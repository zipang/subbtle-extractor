import type { FC } from "react";
import { AspectRatio } from "./AspectRatio";
import { Box, type BoxProps } from "./Box";
import { makeArray } from "@utils/array-utils";

import "./grid-styles.css";

// These classes have responsive props in the scss file
const cols = ["", "", "two-columns", "three-columns", "four-columns"];

export interface GridProps extends BoxProps {
	columns: 1 | 2 | 3 | 4;
	/**
	 * Define the grid items proportions
	 * @default 4/3
	 */
	aspectRatio?: number;
	/**
	 * Tell how an image or video fits into a grid item
	 */
	imageFit?: "cover" | "fill" | "contain";
}

/**
 * A grid with same-sized grid items
 * The children elements are the grid children
 * If aspectRatio is passed, Every child is wrapped inside an AspectRatio component
 */
export const Grid: FC<GridProps> = ({
	columns = 3,
	gap = "2rem",
	imageFit = "cover",
	aspectRatio = 4 / 3,
	children = [],
	...rest
}) => (
	<Box className={`grid ${cols[columns]}`} gap={gap} {...rest}>
		{makeArray(children).map((item) => (
			<AspectRatio className="grid-item" imageFit={imageFit} ratio={aspectRatio}>
				{item}
			</AspectRatio>
		))}
	</Box>
);
