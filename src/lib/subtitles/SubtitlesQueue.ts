import type { SubtitleEntry } from "./SubtitleEntry";

/**
 * Manages a queue of SubtitleEntry objects and generates subtitle files.
 */
export class SubtitlesQueue {
	private entries: SubtitleEntry[] = [];

	/**
	 * Add a new subtitle entry to the queue.
	 * Entries are kept sorted by start time.
	 * @param entry - The SubtitleEntry to add.
	 */
	push(entry: SubtitleEntry): void {
		this.entries.push(entry);
		this.entries.sort((a, b) => a.start - b.start);
	}

	/**
	 * Returns all subtitle entries in order.
	 */
	getAll(): SubtitleEntry[] {
		return [...this.entries];
	}

	/**
	 * Generates an SRT subtitle file as a string.
	 */
	generateSRT(): string {
		return this.entries
			.map((entry, idx) => entry.toSRT(idx + 1))
			.join("\n")
			.trim();
	}

	/**
	 * Generates a VTT subtitle file as a string.
	 */
	generateVTT(): string {
		const header = "WEBVTT\n\n";
		return (
			header +
			this.entries
				.map((entry) => entry.toVTT())
				.join("\n")
				.trim()
		);
	}

	/**
	 * Clears all entries from the queue.
	 */
	clear(): void {
		this.entries = [];
	}
}
