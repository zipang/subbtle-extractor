import {
	type RgbVector,
	type RgbaVector,
	type HslVector,
	type HslaVector,
	rgbToHsl,
	hslToRgb
} from "@utils/color-utils";

/**
 * Frame: wraps ImageData and provides color space utilities and pixel manipulation.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 */
export class Frame implements Omit<ImageData, "colorSpace"> {
	readonly width: number;
	readonly height: number;
	readonly data: Uint8ClampedArray;

	/**
	 * Construct a Frame from an ImageData object.
	 * @param imageData - The ImageData to wrap.
	 */
	constructor(imageData: ImageData) {
		this.width = imageData.width;
		this.height = imageData.height;
		this.data = imageData.data;
	}

	/**
	 * Get the RGB value at pixel position [x, y].
	 */
	public getRgbPixel(x: number, y: number): RgbVector {
		this._checkBounds(x, y);
		const idx = (y * this.width + x) * 4;
		const d = this.data;
		return [d[idx], d[idx + 1], d[idx + 2]];
	}

	/**
	 * Get the RGBA value at pixel position [x, y].
	 */
	public getRgbaPixel(x: number, y: number): RgbaVector {
		this._checkBounds(x, y);
		const idx = (y * this.width + x) * 4;
		const d = this.data;
		return [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]];
	}

	/**
	 * Get the HSL value at pixel position [x, y].
	 */
	public getHslPixel(x: number, y: number): HslVector {
		const rgb = this.getRgbPixel(x, y);
		return rgbToHsl(rgb);
	}

	/**
	 * Get the HSLA value at pixel position [x, y].
	 */
	public getHslaPixel(x: number, y: number): HslaVector {
		const rgba = this.getRgbaPixel(x, y);
		const hsl = rgbToHsl(rgba);
		return [hsl[0], hsl[1], hsl[2], rgba[3]];
	}

	/**
	 * Define the new RGB value for the pixel [x,y].
	 */
	public setPixelRgb(x: number, y: number, rgb: RgbVector): void {
		this._checkBounds(x, y);
		const idx = (y * this.width + x) * 4;
		const d = this.data;
		d[idx] = rgb[0];
		d[idx + 1] = rgb[1];
		d[idx + 2] = rgb[2];
		// Alpha remains unchanged
	}

	/**
	 * Define the new RGBA value for the pixel [x,y].
	 */
	public setPixelRgba(x: number, y: number, rgba: RgbaVector): void {
		this._checkBounds(x, y);
		const idx = (y * this.width + x) * 4;
		const d = this.data;
		d[idx] = rgba[0];
		d[idx + 1] = rgba[1];
		d[idx + 2] = rgba[2];
		d[idx + 3] = rgba[3];
	}

	/**
	 * Define the new HSL value for the pixel [x,y].
	 */
	public setPixelHsl(x: number, y: number, hsl: HslVector): void {
		this.setPixelRgb(x, y, hslToRgb(hsl));
	}

	/**
	 * Define the new HSLA value for the pixel [x,y].
	 */
	public setPixelHsla(x: number, y: number, hsla: HslaVector): void {
		const rgb = hslToRgb(hsla);
		this.setPixelRgba(x, y, [rgb[0], rgb[1], rgb[2], hsla[3]]);
	}

	/**
	 * Create a copy of the current Frame.
	 */
	public clone(): Frame {
		const copy = new ImageData(
			new Uint8ClampedArray(this.data),
			this.width,
			this.height
		);
		return new Frame(copy);
	}

	/**
	 * Apply a filter to the current frame and return a new Frame.
	 * The filter receives (x, y, rgba) and returns a new RGBA value.
	 */
	public applyFilter(
		filter: (x: number, y: number, rgba: RgbaVector) => RgbaVector
	): Frame {
		const out = this.clone();
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const oldRgba = this.getRgbaPixel(x, y);
				const newRgba = filter(x, y, oldRgba);
				out.setPixelRgba(x, y, newRgba);
			}
		}
		return out;
	}

	/**
	 * Internal: Assert that (x, y) is within bounds.
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 * @throws RangeError if out of bounds
	 */
	private _checkBounds(x: number, y: number): void {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			throw new RangeError(
				`Pixel coordinates (${x}, ${y}) out of bounds for frame size ${this.width}x${this.height}`
			);
		}
	}
}
