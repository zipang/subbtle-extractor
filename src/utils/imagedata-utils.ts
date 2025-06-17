/**
 * Polyfill for the ImageData constructor, matching the browser API as closely as possible.
 * Supports:
 *   new ImageData(width, height)
 *   new ImageData(width, height, settings)
 *   new ImageData(data, width)
 *   new ImageData(data, width, height)
 *   new ImageData(data, width, height, settings)
 */
export const registerImageDataPolyfill = async () => {
	if ("ImageData" in global) {
		return;
	}

	type ImageDataSettings = { colorSpace?: string };

	class ImageData {
		readonly data: Uint8ClampedArray;
		readonly width: number;
		readonly height: number;

		constructor(width: number, height: number, settings?: ImageDataSettings);
		constructor(
			data: Uint8ClampedArray,
			width: number,
			height?: number,
			settings?: ImageDataSettings
		);
		constructor(
			arg1: number | Uint8ClampedArray,
			arg2: number,
			arg3?: number | ImageDataSettings,
			arg4?: ImageDataSettings
		) {
			if (typeof arg1 === "number" && typeof arg2 === "number") {
				// new ImageData(width, height, settings?)
				const width = arg1;
				const height = arg2;
				const settings = (typeof arg3 === "object" ? arg3 : undefined) as
					| ImageDataSettings
					| undefined;
				const data = new Uint8ClampedArray(width * height * 4);
				this.data = data;
				this.width = width;
				this.height = height;
				// settings is ignored for now
			} else if (arg1 instanceof Uint8ClampedArray && typeof arg2 === "number") {
				// new ImageData(data, width, height?, settings?)
				const data = arg1;
				const width = arg2;
				let height: number;
				let settings: ImageDataSettings | undefined;
				if (typeof arg3 === "number") {
					height = arg3;
					settings = arg4;
				} else {
					// height is optional, infer from data length
					height = data.length / (width * 4);
					settings = arg3 as ImageDataSettings | undefined;
				}
				if (data.length !== width * height * 4) {
					throw new Error(
						"ImageData: data length does not match width * height * 4"
					);
				}
				this.data = data;
				this.width = width;
				this.height = height;
				// settings is ignored for now
			} else {
				throw new TypeError("Invalid arguments for ImageData constructor");
			}
			Object.freeze(this); // Make properties read-only
		}
	}

	// @ts-ignore
	global.ImageData = ImageData;
};
