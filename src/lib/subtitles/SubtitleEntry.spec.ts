import { describe, it, expect } from "bun:test";
import { SubtitleEntry } from "./SubtitleEntry";
import { HOUR, MINUTE, SECOND } from "@utils/timestamps-utils";

describe("SubtitleEntry", () => {
	it("should construct with valid values", () => {
		const entry = new SubtitleEntry(1000, 2000, "Hello");
		expect(entry.start).toBe(1000);
		expect(entry.end).toBe(2000);
		expect(entry.text).toBe("Hello");
	});

	it("contructor should throw if start or end is negative", () => {
		expect(() => new SubtitleEntry(-1, 1000, "Bad")).toThrow();
		expect(() => new SubtitleEntry(1000, -1, "Bad")).toThrow();
	});

	it("contructor should throw if end < start", () => {
		expect(() => new SubtitleEntry(2000, 1000, "Bad")).toThrow();
	});

	it("moveBy() should properly move start and end time", () => {
		const entry = new SubtitleEntry(2000, 3000, "Back to the Future");
		entry.moveBy(1000);
		expect(entry.start).toBe(3000);
		expect(entry.end).toBe(4000);
	});

	it("moveBy() should throw if result is negative", () => {
		const entry = new SubtitleEntry(500, 1500, "Shift");
		expect(() => entry.moveBy(-600)).toThrow();
	});

	it("updateDuration() should set end = start + duration", () => {
		const entry = new SubtitleEntry(1000, 2000, "Duration");
		entry.updateDuration(500);
		expect(entry.end).toBe(1500);
	});

	it("updateDuration() should throw if duration is negative", () => {
		const entry = new SubtitleEntry(1000, 2000, "Duration");
		expect(() => entry.updateDuration(-100)).toThrow();
	});

	it("toSRT() should return correct format", () => {
		const start = 3 * HOUR + 20 * MINUTE + 5 * SECOND + 123;
		const end = 3 * HOUR + 20 * MINUTE + 7 * SECOND + 456;
		const entry = new SubtitleEntry(start, end, "Subtitle");
		const srt = entry.toSRT(1);
		const expected = ["1", "03:20:05,123 --> 03:20:07,456", "Subtitle", ""].join(
			"\n"
		);
		expect(srt).toBe(expected);
	});

	it("toVTT() should return correct format", () => {
		const start = 3 * HOUR + 20 * MINUTE + 5 * SECOND + 123;
		const end = 3 * HOUR + 20 * MINUTE + 7 * SECOND + 456;
		const entry = new SubtitleEntry(start, end, "Subtitle");
		const vtt = entry.toVTT();
		const expected = ["03:20:05.123 --> 03:20:07.456", "Subtitle", ""].join("\n");
		expect(vtt).toBe(expected);
	});
});
