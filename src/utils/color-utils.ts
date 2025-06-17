/**
 * Utilities for color space conversion, quantization, and palette mapping.
 * All functions are pure and fully typed.
 */

/**
 * A RGB color vector.
 */
export type RgbVector = [number, number, number];
export type RgbaVector = [number, number, number, number];

/**
 * HSL color vector
 * - `Hue`: [0,360] Think of a color wheel. Around 0° and 360° are reds - 120° are greens, 240° are blues. Use anything in between 0-360. Values above and below will be modulus 360.
 * - `Saturation`: [0,100] 0% is completely denatured (grayscale). 100% is fully saturated (full color).
 * - `Lightness`: [0,100] 0% is completely dark (black). 100% is completely light (white). 50% is average lightness.
 */
export type HslVector = RgbVector;
export type HslaVector = RgbaVector;

export const BLACK: RgbaVector = [0, 0, 0, 255];
export const WHITE: RgbaVector = [255, 255, 255, 255];
export const RED: RgbaVector = [255, 0, 0, 255];
export const GREEN: RgbaVector = [0, 255, 0, 255];
export const BLUE: RgbaVector = [0, 0, 255, 255];
export const GRAY: RgbaVector = [128, 128, 128, 255];
export const YELLOW: RgbaVector = [255, 255, 0, 255];
export const MAGENTA: RgbaVector = [255, 0, 255, 255];
export const CYAN: RgbaVector = [0, 255, 255, 255];

/**
 * @param rgb
 * @returns CSS suitable representation of the RBG color
 */
export const rgbCssColor = (rgb: RgbVector) => `rgb(${rgb})`;

/**
 * @param rgba
 * @returns CSS suitable representation of the RBGA color
 */
export const rgbaCssColor = (rgba: RgbaVector) => `rgba(${rgba})`;

/**
 * Convert an RGB color to HSL.
 * @param rgb - The RGB vector [r, g, b] (0-255)
 * @returns The HSL vector [h, s, l] (h: 0-360, s/l: 0-100)
 */
export function rgbToHsl(rgb: RgbVector | RgbaVector): HslVector {
	const [r, g, b] = rgb.map((v) => v / 255) as RgbVector;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert an HSL color to RGB.
 * @param hsl - The HSL vector [h, s, l] (h: 0-360, s/l: 0-100)
 * @returns The RGB vector [r, g, b] (0-255)
 */
export const hslToRgb = (hsl: HslVector | HslaVector): RgbVector => {
	let [hue, sat, ligth] = hsl;

	sat /= 100;
	ligth /= 100;

	const k = (n: number) => (n + hue / 30) % 12;
	const a = sat * Math.min(ligth, 1 - ligth);
	const f = (n: number) =>
		ligth - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};

/**
 * Compute the Euclidean distance between two RGB colors.
 * @param a - First color [r, g, b]
 * @param b - Second color [r, g, b]
 * @returns The distance (0-441.67)
 */
export function colorDistance(a: RgbVector, b: RgbVector): number {
	return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/**
 * Options for quantization.
 */
export interface QuantizeOptions {
	palette: RgbVector[];
	threshold?: number; // Optional: max distance to match palette
}

/**
 * Returns a filter function that maps each pixel to the closest color in the palette.
 * @param opts - Quantization options
 * @returns A filter function to be used with Frame.applyFilter
 */
export function quantizeFilter(
	opts: QuantizeOptions
): (x: number, y: number, rgba: RgbaVector) => RgbaVector {
	const { palette, threshold } = opts;
	return (_x, _y, rgba) => {
		const rgb: RgbVector = [rgba[0], rgba[1], rgba[2]];
		let minDist = Number.POSITIVE_INFINITY;
		let closest: RgbVector = palette[0];
		for (const color of palette) {
			const dist = colorDistance(rgb, color);
			if (dist < minDist) {
				minDist = dist;
				closest = color;
			}
		}
		if (threshold !== undefined && minDist > threshold) {
			// Optionally, return original if no palette color is close enough
			return rgba;
		}
		return [closest[0], closest[1], closest[2], rgba[3]];
	};
}

// Placeholders for future color space conversions (XYZ, LAB, LCH, etc.)
// These can be implemented as needed using the reference code provided.
