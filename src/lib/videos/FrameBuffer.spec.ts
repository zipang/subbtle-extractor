import { beforeAll, describe, it, expect } from "bun:test";
import type { RgbaVector } from "@utils/color-utils";
import { registerImageDataPolyfill } from "@utils/imagedata-utils";
import { Frame } from "./Frame";
import { FrameBuffer, FrameBufferError } from "./FrameBuffer";
import {
	BLACK,
	GRAY,
	WHITE,
	RED,
	GREEN,
	BLUE,
	YELLOW,
	MAGENTA,
	CYAN
} from "@utils/color-utils";

// Helper to create a Frame with a solid color
function createFrame(width: number, height: number, fill: RgbaVector): Frame {
	const arr = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < arr.length; i += 4) {
		arr[i] = fill[0];
		arr[i + 1] = fill[1];
		arr[i + 2] = fill[2];
		arr[i + 3] = fill[3];
	}
	const imgData = new ImageData(arr, width, height);
	return new Frame(imgData);
}

beforeAll(() => {
	registerImageDataPolyfill();
});

describe("FrameBuffer", () => {
	const w = 8, h = 8, size = 3;
	const x = 4, y = 4;

	it("constructs with correct initial state", () => {
		const buf = new FrameBuffer(w, h, size);
		expect(buf.length).toBe(0);
		expect(buf.isReady).toBe(false);
	});

	it("addFrame() will re-use existing frames when capacity is reached", () => {
		const buf = new FrameBuffer(w, h, size);
		const red = createFrame(w, h, RED);
		const green = createFrame(w, h, GREEN);
		const blue = createFrame(w, h, BLUE);

		buf.addFrame(red);
		expect(buf.length).toBe(1);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(RED);

		buf.addFrame(green);
		expect(buf.length).toBe(2);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(RED);
		expect(buf.getFrame(1).getRgbaPixel(x, y)).toEqual(GREEN);

		buf.addFrame(blue);
		expect(buf.length).toBe(3);
		expect(buf.isReady).toBe(true);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(RED);
		expect(buf.getFrame(1).getRgbaPixel(x, y)).toEqual(GREEN);
		expect(buf.getFrame(2).getRgbaPixel(x, y)).toEqual(BLUE);

		// Add another frame (should overwrite oldest/red)
		const white = createFrame(w, h, WHITE);
		buf.addFrame(white);
		expect(buf.length).toBe(3);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(GREEN);
		expect(buf.getFrame(1).getRgbaPixel(x, y)).toEqual(BLUE);
		expect(buf.getFrame(2).getRgbaPixel(x, y)).toEqual(WHITE);
	});

	it("addFrame() throws on frame size mismatch", () => {
		const buf = new FrameBuffer(w, h, size);
		const badDimensions = createFrame(w + 1, h, BLACK);
		expect(() => buf.addFrame(badDimensions)).toThrow(FrameBufferError);
	});

	it("getFrame() throws on out-of-bounds index", () => {
		const buf = new FrameBuffer(w, h, size);
		const frame = createFrame(w, h, BLACK);
		buf.addFrame(frame);
		expect(() => buf.getFrame(-1)).toThrow(FrameBufferError);
		expect(() => buf.getFrame(1)).toThrow(FrameBufferError);
	});

	it("addFrames() works with variadic and array arguments", () => {
		const buf = new FrameBuffer(w, h, size);

		// Variadic arguments
		buf.clear();
		buf.addFrames(
			createFrame(w, h, RED),
			createFrame(w, h, GREEN),
			createFrame(w, h, BLUE)
		);
		expect(buf.length).toBe(3);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(RED);
		expect(buf.getFrame(1).getRgbaPixel(x, y)).toEqual(GREEN);
		expect(buf.getFrame(2).getRgbaPixel(x, y)).toEqual(BLUE);

		// Use array argument
		buf.clear();
		buf.addFrames([
			createFrame(w, h, RED),
			createFrame(w, h, GREEN),
			createFrame(w, h, BLUE)
		]);
		expect(buf.length).toBe(3);
		expect(buf.getFrame(0).getRgbaPixel(x, y)).toEqual(RED);
		expect(buf.getFrame(1).getRgbaPixel(x, y)).toEqual(GREEN);
		expect(buf.getFrame(2).getRgbaPixel(x, y)).toEqual(BLUE);
	});

	it("clear() empties the buffer and resets state", () => {
		const buf = new FrameBuffer(w, h, size);
		buf.addFrames(
			createFrame(w, h, RED),
			createFrame(w, h, GREEN),
			createFrame(w, h, BLUE)
		);
		expect(buf.length).toBe(3);
		buf.clear();
		expect(buf.length).toBe(0);
		expect(buf.isReady).toBe(false);
		expect(() => buf.getFrame(0)).toThrow(FrameBufferError);
	});

	it("getRgbPixel() and related methods allow access to all frames", () => {
		const buf = new FrameBuffer(w, h, size);
		buf.addFrames(createFrame(w, h, RED), createFrame(w, h, GREEN));

		expect(buf.getRgbPixel(x, y, 0)).toEqual([255, 0, 0]);
		expect(buf.getRgbPixel(x, y, 1)).toEqual([0, 255, 0]);
		expect(buf.getRgbaPixel(x, y, 1)).toEqual(GREEN);

		// All HSL values should be integer!
		expect(Math.round(buf.getHslPixel(x, y, 0)[0])).toBe(0); // Red hue
		expect(Math.round(buf.getHslPixel(x, y, 1)[0])).toBe(120); // Green hue
	});

	it("forEach() iterates over frames in order", () => {
		const buf = new FrameBuffer(w, h, size);
		const inputColors = [GRAY, YELLOW, CYAN];
		inputColors.forEach((color) => buf.addFrame(createFrame(w, h, color)));

		const seen: number[][] = [];
		buf.forEach((frame, idx) => {
			seen.push(frame.getRgbaPixel(x, y));
		});
		expect(seen).toEqual(inputColors);
	});

	it("detectMotion() returns 0 for no change, 100 for all different", () => {
		const w = 8, h = 8, size = 3, x = 4, y = 4;
		const buf = new FrameBuffer(w, h, size);

		buf.addFrames(
			createFrame(w, h, BLACK),
			createFrame(w, h, BLACK),
			createFrame(w, h, WHITE)
		);
		expect(buf.detectMotion(x, y, 10)).toBe(50); // One change out of two possible

		buf.clear();
		buf.addFrames(
			createFrame(w, h, BLACK),
			createFrame(w, h, WHITE),
			createFrame(w, h, GRAY)
		);
		expect(buf.detectMotion(x, y, 10)).toBe(100);

		buf.clear();
		buf.addFrames(
			createFrame(w, h, BLACK),
			createFrame(w, h, BLACK),
			createFrame(w, h, BLACK)
		);
		expect(buf.detectMotion(x, y, 10)).toBe(0); // No motion at all
	});

	it("detectMotion() returns 0 if less than 2 frames", () => {
		const buf = new FrameBuffer(1, 1, size);
		buf.addFrame(createFrame(1, 1, BLACK));
		expect(buf.detectMotion(0, 0, 10)).toBe(0);
	});
});
