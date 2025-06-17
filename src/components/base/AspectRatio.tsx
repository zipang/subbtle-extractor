import type { FC, PropsWithChildren } from "react";
import { Box, type BoxProps } from "./Box";

import "./aspect-ratio-styles.css";

export interface AspectRatioProps extends BoxProps {
	className?: string;
	/**
	 * The rapport of the width to the height
	 * @default 4/3
	 */
	ratio?: number;
	/**
	 * Tell how an image or video should fit inside
	 */
	imageFit?: "cover" | "fill" | "contain";
}

const asPercent = (ratio: number) => {
	return `${(1 / ratio) * 100}%`;
};

/**
 * Box with fixed proportions (w=100%, h=w/ratio) and overflow hidden
 */
export const AspectRatio: FC<PropsWithChildren<AspectRatioProps>> = ({
	ratio,
	className = "",
	imageFit = "cover",
	children,
	...rest
}) => {
	if (ratio === undefined) {
		return (
			<Box className={`image-${imageFit} ${className}`} {...rest}>
				{children}
			</Box>
		);
	}

	return (
		<Box
			className={`aspect-ratio image-${imageFit} ${className}`}
			style={{ "padding-top": asPercent(ratio) }}
			{...rest}
		>
			{children}
		</Box>
	);
};
