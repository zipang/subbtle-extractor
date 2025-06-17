import { beforeAll, expect, describe, it } from "bun:test";
import { BLACK, BLUE, RED, type RgbaVector } from "@utils/color-utils";
import { Frame } from "./Frame";
import { registerImageDataPolyfill } from "@utils/imagedata-utils";

/**
 * Helper to create ImageData with given width, height, and fill color.
 * Compatible with @andreekeberg/imagedata polyfill.
 */
function createImageData(
	width: number,
	height: number,
	fill: RgbaVector = [0, 0, 0, 255]
): ImageData {
	const data = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < data.length; i += 4) {
		data[i] = fill[0];
		data[i + 1] = fill[1];
		data[i + 2] = fill[2];
		data[i + 3] = fill[3];
	}
	return new ImageData(data, width, height);
}

beforeAll(() => {
	registerImageDataPolyfill();
});

describe("Frame", () => {
	const w = 8,
		h = 8;

	it("should construct and expose width/height/data", () => {
		const imgData = createImageData(w, h, BLACK);
		const frame = new Frame(imgData);
		expect(frame.width).toBe(w);
		expect(frame.height).toBe(h);
		expect(frame.data.length).toBe(w * h * 4);
	});

	it("should get and set RGB and RGBA pixels", () => {
		const imgData = createImageData(w, h, BLACK);
		const frame = new Frame(imgData);

		frame.setPixelRgb(0, 0, [10, 20, 30]);
		expect(frame.getRgbPixel(0, 0)).toEqual([10, 20, 30]);
		expect(frame.getRgbaPixel(0, 0)).toEqual([10, 20, 30, 255]);

		frame.setPixelRgba(1, 0, [100, 110, 120, 130]);
		expect(frame.getRgbPixel(1, 0)).toEqual([100, 110, 120]);
		expect(frame.getRgbaPixel(1, 0)).toEqual([100, 110, 120, 130]);
	});

	it("should get and set HSL and HSLA pixels", () => {
		const imgData = createImageData(w, h, BLACK);
		const frame = new Frame(imgData);

		// Set red using HSL
		frame.setPixelHsl(0, 0, [0, 100, 50]);
		expect(frame.getRgbPixel(0, 0)).toEqual([255, 0, 0]);

		// Set green using HSLA
		frame.setPixelHsla(1, 0, [120, 100, 50, 128]);
		expect(frame.getRgbPixel(1, 0)).toEqual([0, 255, 0]);
		expect(frame.getRgbaPixel(1, 0)).toEqual([0, 255, 0, 128]);
	});

	it("should get HSL and HSLA values correctly", () => {
		const imgData = createImageData(w, h, RED);
		const frame = new Frame(imgData);

		expect(frame.getHslPixel(0, 0)[0]).toBe(0); // Hue for red
		expect(frame.getHslPixel(0, 0)[1]).toBe(100); // Sat for red
		expect(frame.getHslPixel(0, 0)[2]).toBe(50); // Lightness for red

		expect(frame.getHslaPixel(0, 0)[3]).toBe(255);
	});

	it("should clone itself deeply", () => {
		const imgData = createImageData(w, h, BLUE);
		const frame = new Frame(imgData);
		const clone = frame.clone();

		expect(clone).not.toBe(frame);
		expect(clone.width).toBe(frame.width);
		expect(clone.height).toBe(frame.height);
		expect(clone.data).not.toBe(frame.data);
		expect(Array.from(clone.data)).toEqual(Array.from(frame.data));

		// Mutate clone, original should not change
		clone.setPixelRgb(0, 0, [1, 2, 3]);
		expect(frame.getRgbPixel(0, 0)).toEqual([0, 0, 255]);
		expect(clone.getRgbPixel(0, 0)).toEqual([1, 2, 3]);
	});

	it("should apply a filter and return a new Frame", () => {
		const imgData = createImageData(w, h, BLACK);
		const frame = new Frame(imgData);

		// Simple invert filter
		const filter = (_x: number, _y: number, rgba: RgbaVector): RgbaVector => [
			255 - rgba[0],
			255 - rgba[1],
			255 - rgba[2],
			rgba[3]
		];

		const out = frame.applyFilter(filter);
		expect(out).not.toBe(frame);
		expect(out.getRgbPixel(0, 0)).toEqual([255, 255, 255]);
		expect(frame.getRgbPixel(0, 0)).toEqual([0, 0, 0]);
	});

	it("should throw on out-of-bounds access", () => {
		const imgData = createImageData(w, h, BLACK);
		const frame = new Frame(imgData);

		expect(() => frame.getRgbPixel(-1, 0)).toThrow();
		expect(() => frame.setPixelRgb(w, 0, [1, 2, 3])).toThrow();
		expect(() => frame.getRgbaPixel(0, h)).toThrow();
	});
});
