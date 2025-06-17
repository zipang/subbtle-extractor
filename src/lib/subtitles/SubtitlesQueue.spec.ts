import { describe, it, expect } from "bun:test";
import { SubtitlesQueue } from "./SubtitlesQueue";
import { SubtitleEntry } from "./SubtitleEntry";

describe("SubtitlesQueue", () => {
	it("push() should add a SubtitleEntry and keep entries sorted by start time when entries are pushed in any order", () => {
		const queue = new SubtitlesQueue();
		const entry1 = new SubtitleEntry(2000, 3000, "Second");
		const entry2 = new SubtitleEntry(1000, 1500, "First");
		queue.push(entry1);
		queue.push(entry2);

		const all = queue.getAll();
		expect(all.length).toBe(2);
		expect(all[0].text).toBe("First");
		expect(all[1].text).toBe("Second");
	});

	it("getAll() should return a copy of the entries array when called", () => {
		const queue = new SubtitlesQueue();
		const entry = new SubtitleEntry(0, 1000, "Hello");
		queue.push(entry);

		const all = queue.getAll();
		expect(all).toEqual([entry]);
		// Mutating the returned array should not affect the queue
		all.pop();
		expect(queue.getAll().length).toBe(1);
	});

	it("generateSRT() should generate a valid SRT string when entries exist", () => {
		const queue = new SubtitlesQueue();
		queue.push(new SubtitleEntry(0, 1000, "Hello"));
		queue.push(new SubtitleEntry(2000, 3000, "World"));

		const srt = queue.generateSRT();
		expect(typeof srt).toBe("string");
		expect(srt).toContain("1");
		expect(srt).toContain("Hello");
		expect(srt).toContain("2");
		expect(srt).toContain("World");
	});

	it("generateSRT() should return an empty string when there are no entries", () => {
		const queue = new SubtitlesQueue();
		expect(queue.generateSRT()).toBe("");
	});

	it("generateVTT() should generate a valid VTT string with header when entries exist", () => {
		const queue = new SubtitlesQueue();
		queue.push(new SubtitleEntry(0, 1000, "Hello"));
		const vtt = queue.generateVTT();
		expect(vtt.startsWith("WEBVTT")).toBe(true);
		expect(vtt).toContain("Hello");
	});

	it("generateVTT() should return only the header when there are no entries", () => {
		const queue = new SubtitlesQueue();
		expect(queue.generateVTT()).toBe("WEBVTT\n\n");
	});

	it("clear() should remove all entries from the queue when called", () => {
		const queue = new SubtitlesQueue();
		queue.push(new SubtitleEntry(0, 1000, "Hello"));
		queue.clear();
		expect(queue.getAll().length).toBe(0);
	});
});
