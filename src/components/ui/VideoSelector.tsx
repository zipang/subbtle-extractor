import type { FC } from "hono/jsx";
import { Box, VStack, Text } from "@components/base";
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
 */
export const VideoSelector: FC<VideoSelectorProps> = ({
	label = "Drag or click to upload a video"
}) => (
	<VStack
		justifyContent="space-evenly"
		className="video-selector"
		tabindex={0}
		role="button"
		aria-label={label}
	>
		<Box className="video-selector-icon" aria-hidden="true">
			+
		</Box>
		<Text className="video-selector-label">{label}</Text>
	</VStack>
);
