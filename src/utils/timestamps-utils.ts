/**
 * Duration constants in milliseconds.
 */
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

const pad = (n: number, z = 2) => String(n).padStart(z, "0");
const padMs = (n: number) => String(n).padStart(3, "0");

/**
 * Formats a timestamp in milliseconds to SRT/VTT timecode (HH:MM:SS,mmm/HH:MM:SS.mmm).
 * @param ts - Timestamp in milliseconds.
 * @param sep - comma (SRT default) or decimal point (VTT) to separate the milliseconds
 * @returns Timecode string
 */
export function formatTimestamp(ts: number, sep: "." | "," = ","): string {
	const hours = Math.floor(ts / HOUR);
	// done with the hours
	ts -= hours * HOUR;
	const minutes = Math.floor(ts / MINUTE);
	// done with the minutes
	ts -= minutes * MINUTE;
	const seconds = Math.floor(ts / SECOND);
	// done with the seconds
	ts -= seconds * SECOND;
	const milliseconds = Math.floor(ts % SECOND);

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${sep}${padMs(milliseconds)}`;
}
