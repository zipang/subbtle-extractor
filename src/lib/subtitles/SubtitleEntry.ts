import { formatTimestamp } from "@utils/timestamps-utils";

/**
 * Represents a single subtitle entry with start and end timestamps and text.
 */
export class SubtitleEntry {
	/**
	 * Start time in milliseconds.
	 */
	start: number;

	/**
	 * End time in milliseconds.
	 */
	end: number;

	/**
	 * Subtitle text.
	 */
	text: string;

	/**
	 * @param start - Start time in milliseconds.
	 * @param end - End time in milliseconds.
	 * @param text - Subtitle text.
	 */
	constructor(start: number, end: number, text: string) {
		if (start < 0 || end < 0) throw new Error("Timestamps must be non-negative");
		if (end < start) throw new Error("End time must be after start time");
		this.start = start;
		this.end = end;
		this.text = text;
	}

	/**
	 * Move the subtitle by a certain amount of ms
	 * @param amount - decalage in ms
	 */
	moveBy(amount: number) {
		if (this.start + amount < 0) throw new Error("Timestamps cannot be negative");
		this.start += amount;
		this.end += amount;
	}

	/**
	 * Update the known duration of a subtitle
	 * @param duration
	 */
	updateDuration(duration: number) {
		if (duration < 0) throw new Error("Subtitle duration cannot be negative");
		this.end = this.start + duration;
	}

	/**
	 * Returns the entry as SRT formatted string.
	 * @param index - Subtitle index (1-based).
	 */
	toSRT(index: number): string {
		return `${index}\n${formatTimestamp(this.start)} --> ${formatTimestamp(this.end)}\n${this.text}\n`;
	}

	/**
	 * Returns the entry as VTT formatted string.
	 */
	toVTT(): string {
		return `${formatTimestamp(this.start, ".")} --> ${formatTimestamp(this.end, ".")}\n${this.text}\n`;
	}
}
