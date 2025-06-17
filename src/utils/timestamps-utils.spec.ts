import { describe, it, expect } from "bun:test";
import { formatTimestamp, HOUR, MINUTE, SECOND } from "./timestamps-utils";

describe("formatTime", () => {
	it("should format large duration exceeding 24 hours", () => {
		const ms =
			27 * HOUR + // 27 hours
			15 * MINUTE + // 15 minutes
			42 * SECOND + // 42 seconds
			987; // 987 milliseconds

		// hours are not modulo 24, so expect "27:15:42,987"
		expect(formatTimestamp(ms, ",")).toBe("27:15:42,987");
	});
});
