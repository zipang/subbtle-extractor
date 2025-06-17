import { expect, describe, it } from "bun:test";
import {
	rgbToHsl,
	hslToRgb,
	colorDistance,
	quantizeFilter,
	type RgbVector
} from "./color-utils";

describe("rgbToHsl", () => {
	it("should convert black [0,0,0] to [0,0,0]", () => {
		expect(rgbToHsl([0, 0, 0])).toEqual([0, 0, 0]);
	});

	it("should convert white [255,255,255] to [0,0,100]", () => {
		expect(rgbToHsl([255, 255, 255])).toEqual([0, 0, 100]);
	});

	it("should convert red [255,0,0] to [0,100,50]", () => {
		expect(rgbToHsl([255, 0, 0])).toEqual([0, 100, 50]);
	});

	it("should convert green [0,255,0] to [120,100,50]", () => {
		expect(rgbToHsl([0, 255, 0])).toEqual([120, 100, 50]);
	});

	it("should convert blue [0,0,255] to [240,100,50]", () => {
		expect(rgbToHsl([0, 0, 255])).toEqual([240, 100, 50]);
	});

	it("should convert gray [128,128,128] to [0,0,50]", () => {
		expect(rgbToHsl([128, 128, 128])).toEqual([0, 0, 50]);
	});
});

describe("hslToRgb", () => {
	it("should convert [0,0,0] to black [0,0,0]", () => {
		expect(hslToRgb([0, 0, 0])).toEqual([0, 0, 0]);
	});

	it("should convert [0,0,100] to white [255,255,255]", () => {
		expect(hslToRgb([0, 0, 100])).toEqual([255, 255, 255]);
	});

	it("should convert [0,100,50] to red [255,0,0]", () => {
		expect(hslToRgb([0, 100, 50])).toEqual([255, 0, 0]);
	});

	it("should convert [120,100,50] to green [0,255,0]", () => {
		expect(hslToRgb([120, 100, 50])).toEqual([0, 255, 0]);
	});

	it("should convert [240,100,50] to blue [0,0,255]", () => {
		expect(hslToRgb([240, 100, 50])).toEqual([0, 0, 255]);
	});

	it("should convert [0,0,50] to gray [128,128,128]", () => {
		expect(hslToRgb([0, 0, 50])).toEqual([128, 128, 128]);
	});

	it("should round-trip rgbToHsl and hslToRgb for a color", () => {
		const rgb: RgbVector = [123, 45, 67];
		const hsl = rgbToHsl(rgb);
		const rgb2 = hslToRgb(hsl);
		// Allow a tolerance of 1 due to rounding
		expect(rgb2[0]).toBeCloseTo(rgb[0], 0);
		expect(rgb2[1]).toBeCloseTo(rgb[1], 0);
		expect(rgb2[2]).toBeCloseTo(rgb[2], 0);
	});
});

describe("colorDistance", () => {
	it("should be 0 for identical colors", () => {
		expect(colorDistance([10, 20, 30], [10, 20, 30])).toBe(0);
	});

	it("should be correct for [0,0,0] and [255,255,255]", () => {
		expect(colorDistance([0, 0, 0], [255, 255, 255])).toBeCloseTo(
			Math.sqrt(3 * 255 * 255)
		);
	});

	it("should be symmetric", () => {
		expect(colorDistance([10, 20, 30], [40, 50, 60])).toBe(
			colorDistance([40, 50, 60], [10, 20, 30])
		);
	});
});

describe("quantizeFilter", () => {
	const palette: RgbVector[] = [
		[0, 0, 0],
		[255, 255, 255],
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255]
	];

	it("should map [254,1,1] to [255,0,0] (red)", () => {
		const filter = quantizeFilter({ palette });
		expect(filter(0, 0, [254, 1, 1, 255])).toEqual([255, 0, 0, 255]);
	});

	it("should map [10,10,10] to [0,0,0] (black)", () => {
		const filter = quantizeFilter({ palette });
		expect(filter(0, 0, [10, 10, 10, 128])).toEqual([0, 0, 0, 128]);
	});

	it("should return original if no palette color is within threshold", () => {
		const filter = quantizeFilter({ palette, threshold: 5 });
		// [10,10,10] is farther than 5 from [0,0,0]
		expect(filter(0, 0, [10, 10, 10, 200])).toEqual([10, 10, 10, 200]);
	});
});
