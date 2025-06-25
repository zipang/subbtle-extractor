/** @jsxImportSource hono/jsx */
import { useRef, useState } from "hono/jsx";
import type { FC } from "hono/jsx";
import { Box, Text, VStack } from "@components/base";
import { clsx } from "clsx";

import "./video-selector-styles.css";

/**
 * Props for the VideoSelector component.
 * @property label - The label displayed in the drop area. Default: "Drag or click to upload a video".
 * @property onVideoSelected - Handler called when a video is selected.
 * @property onPlay - Handler called when video is played.
 * @property onPause - Handler called when video is paused.
 * @property className - Additional class names for the root element.
 */
export interface VideoSelectorProps {
	label?: string;
	onVideoSelected?: (fileOrUrl: File | string) => void;
	onPlay?: () => void;
	onPause?: () => void;
	className?: string;
}

/**
 * VideoSelector presents a 4/3 area for uploading or selecting a video.
 * When no video is selected, it displays a drop area with a label and a "+" icon.
 * Once a video is selected, it displays a video player.
 */
export const VideoSelector: FC<VideoSelectorProps> = ({
	label = "Drag, paste or click to upload a video",
	onVideoSelected,
	onPlay,
	onPause,
	className
}) => {
	const [videoSrc, setVideoSrc] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileSelect = (file: File) => {
		const videoUrl = URL.createObjectURL(file);
		setVideoSrc(videoUrl);
		onVideoSelected?.(file);
	};

	const handleUrlSelect = (url: string) => {
		setVideoSrc(url);
		onVideoSelected?.(url);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragOver(false);
		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pastedText = event.clipboardData?.getData("text");
		if (pastedText) {
			handleUrlSelect(pastedText);
		}
	};

	const handleClick = () => {
		console.log("We should open  the file selector");
		fileInputRef.current?.click();
	};

	return (
		<VStack
			justifyContent="space-evenly"
			className={clsx("video-selector", { "drag-over": isDragOver }, className)}
			tabIndex={0}
			// biome-ignore lint/a11y/useSemanticElements: we cannot use a button here
			role="button"
			aria-label={label}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onPaste={handlePaste}
			onClick={handleClick}
		>
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={(e) =>
					handleFileSelect((e.target as HTMLInputElement).files![0])
				}
				accept="video/*"
			/>
			{videoSrc ? (
				<video src={videoSrc} controls onPlay={onPlay} onPause={onPause} />
			) : (
				<>
					<Box className="video-selector-icon" aria-hidden="true">
						+
					</Box>
					<Text className="video-selector-label">{label}</Text>
				</>
			)}
		</VStack>
	);
};
