import type { Frame } from "./Frame";
import {
	type RgbVector,
	type RgbaVector,
	type HslVector,
	type HslaVector,
	colorDistance
} from "../../utils/color-utils";

/**
 * Error codes for FrameBufferError.
 */
export const FRAMEBUFFER_ERROR = {
	OUT_OF_BOUNDS: "OUT_OF_BOUNDS",
	INVALID_FRAME_SIZE: "INVALID_FRAME_SIZE"
} as const;

export class FrameBufferError extends Error {
	code: keyof typeof FRAMEBUFFER_ERROR;
	constructor(message: string, code: keyof typeof FRAMEBUFFER_ERROR) {
		super(message);
		this.name = "FrameBufferError";
		this.code = code;
	}
}

/**
 * Cyclic FIFO buffer for Frame objects.
 */
export class FrameBuffer {
	private readonly buffer: (Frame | null)[];
	private readonly capacity: number;
	private readonly width: number;
	private readonly height: number;

	private _first = 0; // Index of the first (oldest) frame
	private _length = 0; // Number of frames currently in buffer

	/**
	 * Instanciate a new empty frame buffer with `count` frames of `width` `height` size
	 */
	constructor(width: number, height: number, size: number) {
		this.capacity = size;
		this.width = width;
		this.height = height;
		this.buffer = Array(size).fill(null);
	}

	/**
	 * Add a new frame at index 0, drop the last one if the buffer is filled (FIFO)
	 */
	addFrame(frame: Frame): void {
		if (frame.width !== this.width || frame.height !== this.height) {
			throw new FrameBufferError(
				`Frame size mismatch: expected ${this.width}x${this.height}, got ${frame.width}x${frame.height}`,
				"INVALID_FRAME_SIZE"
			);
		}

		// Push to the end
		this.buffer[(this._first + this._length) % this.capacity] = frame;
		if (this._length < this.capacity) {
			this._length++;
		} else {
			// The first frame has been replaced
			this._first = (this._first + 1) % this.capacity;
		}
	}

	/**
	 * Add multiple frames to the buffer at once.
	 * Accepts either an array of frames or multiple frame arguments.
	 * @param frames - Array of Frame or multiple Frame arguments
	 */
	addFrames(...frames: (Frame | Frame[])[]): void {
		const flatFrames = frames.flat() as Frame[];
		for (const frame of flatFrames) {
			this.addFrame(frame);
		}
	}

	/**
	 * Get the frame at index (0 = oldest, length-1 = newest)
	 */
	getFrame(index: number): Frame {
		if (index < 0 || index >= this._length) {
			throw new FrameBufferError(
				`Frame index ${index} out of bounds (length=${this._length})`,
				"OUT_OF_BOUNDS"
			);
		}
		// Oldest is at (start + (capacity - length)) % capacity
		const physicalIndex = (this._first + index) % this.capacity;
		const frame = this.buffer[physicalIndex];
		if (!frame) {
			throw new FrameBufferError(
				`No frame at index ${index} (physical index ${physicalIndex})`,
				"OUT_OF_BOUNDS"
			);
		}
		return frame;
	}

	/**
	 * Remove all frames from the buffer and reset its state.
	 */
	clear(): void {
		for (let i = 0; i < this.capacity; i++) {
			this.buffer[i] = null;
		}
		this._length = 0;
		this._first = 0;
	}

	/**
	 * Ready when the number of frames is equal to count
	 */
	get isReady(): boolean {
		return this._length === this.capacity;
	}

	/**
	 * The current length of the buffer (number of frames added)
	 */
	get length(): number {
		return this._length;
	}

	/**
	 * Get the RGB value for pixel at position [x, y] in frame z
	 */
	getRgbPixel(x: number, y: number, z: number): RgbVector {
		return this.getFrame(z).getRgbPixel(x, y);
	}

	getRgbaPixel(x: number, y: number, z: number): RgbaVector {
		return this.getFrame(z).getRgbaPixel(x, y);
	}

	getHslPixel(x: number, y: number, z: number): HslVector {
		return this.getFrame(z).getHslPixel(x, y);
	}

	getHslaPixel(x: number, y: number, z: number): HslaVector {
		return this.getFrame(z).getHslaPixel(x, y);
	}

	/**
	 * Look at each pixel at position [x, y] inside the frame buffer
	 * starting with oldest frame.
	 * If the pixel color has changed between frames add a score of 100 / (capacity-1)
	 * For instance, if the number of frames is 5, we add score of 20 every time the pixel changes color
	 * At the end if the pixel has changed colors on each frame the returned score should be 100
	 * If the pixel didn't change color the returned score should be zero
	 * @param x horizontal position [0, width]
	 * @param y vertical position [0, height]
	 * @param threshold minimal distance from the previous color that count as a change
	 */
	detectMotion(x: number, y: number, threshold: number): number {
		if (this._length < 2) return 0;
		let score = 0;
		const step = 100 / (this._length - 1);
		let prev = this.getRgbPixel(x, y, 0);
		for (let i = 1; i < this._length; i++) {
			const curr = this.getRgbPixel(x, y, i);
			if (colorDistance(prev, curr) >= threshold) {
				score += step;
			}
			prev = curr;
		}
		return Math.round(score);
	}

	/**
	 * Iterate over the available frames (from oldest to newest)
	 */
	forEach(cb: (frame: Frame, index: number) => void): void {
		for (let i = 0; i < this._length; i++) {
			cb(this.getFrame(i), i);
		}
	}
}
