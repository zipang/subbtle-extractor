# UI Component Style Guide

## 1. Component Structure
- Use functional components with TypeScript (`FC<Props>`).
- Export both the component and its props interface.
- Place all layout components in a dedicated directory (e.g., `@components/base`).

## 2. Imports
- Import React types from `"react"`.
- Import base components from `@components/base`.
- Import utility functions from `@utils`.
- Import local stylesheets using the component's class name.

## 3. Props and Types
- Define a dedicated `ComponentProps` interface for each component.
- Document each prop with JSDoc comments, including default values.

## 4. Styling
- Use local CSS files named after the component (e.g., `<component>-styles.css`).
- Link styles to class names used in the component.
- Additional dynamic styles can be added via style attributes like in Chakra UI. The list of this attributes is exported in the interface `BoxProps` : 

```typescript
/**
 * Basic styling via style attributes
 * All major box-related style properties are included for flexibility.
 */
export interface BoxProps {
	as?: "div" | "section" | "aside" | "main" | "header" | "footer" | "nav";
	className?: string;

	// Layout
	display?:
		| "block"
		| "inline"
		| "inline-block"
		| "flex"
		| "inline-flex"
		| "grid"
		| "inline-grid"
		| "none"
		| "contents"
		| "table"
		| "table-row"
		| "table-cell"
		| "list-item"
		| "inherit"
		| "initial"
		| "unset";
	position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
	top?: string | number;
	right?: string | number;
	bottom?: string | number;
	left?: string | number;
	zIndex?: number | "auto";

	// Sizing
	width?: string | number;
	minWidth?: string | number;
	maxWidth?: string | number;
	height?: string | number;
	minHeight?: string | number;
	maxHeight?: string | number;

	// Margin
	margin?: string | number;
	marginTop?: string | number;
	marginRight?: string | number;
	marginBottom?: string | number;
	marginLeft?: string | number;

	// Padding
	padding?: string | number;
	paddingTop?: string | number;
	paddingRight?: string | number;
	paddingBottom?: string | number;
	paddingLeft?: string | number;

	// Border
	border?: string;
	borderWidth?: string | number;
	borderStyle?:
		| "none"
		| "hidden"
		| "dotted"
		| "dashed"
		| "solid"
		| "double"
		| "groove"
		| "ridge"
		| "inset"
		| "outset";
	borderColor?: string;
	borderRadius?: string | number;
	borderTop?: string;
	borderRight?: string;
	borderBottom?: string;
	borderLeft?: string;

	// Background
	background?: string;
	backgroundColor?: string;

	// Color & Typography
	color?: string;
	fontSize?: string | number;
	fontWeight?:
		| "normal"
		| "bold"
		| "bolder"
		| "lighter"
		| number
		| "inherit"
		| "initial"
		| "unset";
	fontFamily?: string;
	lineHeight?: string | number;
	textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
	letterSpacing?: string | number;

	// Box Shadow
	boxShadow?: string;

	// Overflow
	overflow?:
		| "visible"
		| "hidden"
		| "scroll"
		| "auto"
		| "clip"
		| "inherit"
		| "initial"
		| "unset";
	overflowX?:
		| "visible"
		| "hidden"
		| "scroll"
		| "auto"
		| "clip"
		| "inherit"
		| "initial"
		| "unset";
	overflowY?:
		| "visible"
		| "hidden"
		| "scroll"
		| "auto"
		| "clip"
		| "inherit"
		| "initial"
		| "unset";

	// Flexbox/Grid
	flex?: string | number;
	flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
	flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
	justifyContent?:
		| "flex-start"
		| "flex-end"
		| "center"
		| "space-between"
		| "space-around"
		| "space-evenly"
		| "start"
		| "end"
		| "left"
		| "right";
	alignItems?:
		| "stretch"
		| "flex-start"
		| "flex-end"
		| "center"
		| "baseline"
		| "start"
		| "end"
		| "self-start"
		| "self-end";
	alignContent?:
		| "stretch"
		| "flex-start"
		| "flex-end"
		| "center"
		| "space-between"
		| "space-around"
		| "start"
		| "end"
		| "baseline";
	gap?: string | number;
	rowGap?: string | number;
	columnGap?: string | number;
	gridTemplateColumns?: string;
	gridTemplateRows?: string;
	gridColumn?: string;
	gridRow?: string;
	gridArea?: string;

	// Opacity
	opacity?: number;

	// Others
	transition?: string;
	visibility?: "visible" | "hidden" | "collapse" | "inherit" | "initial" | "unset";
	outline?: string;
}
```

## 5. Reusability
- All utility methods should be reusable and imported from a shared utils directory.
- Avoid inline utility functions inside components.

## 6. Component Logic
- Use helper functions for logic (e.g., `getColsClassName`).
- Use utility functions for array or data manipulation (e.g., `makeArray`).

## 8. Accessibility
- Ensure all components are accessible by default. 
- Use key shortcuts to activate functions. Ex: Space to play/pause, Enter to send the edited value.
- Use semantic HTML elements via base components.

## 9. Documentation
- Document the component and its props using JSDoc.
- Include a description of the component's purpose and usage.

# Example

This is an example of a component using this style guide

```tsx
import type { FC } from "react";
import { AspectRatio, Box, type BoxProps } from "@components/base";
import { makeArray } from "@utils/array-utils";

// Local styles linked to our `.grid` class name
import "./grid-styles.css";


export interface GridProps extends BoxProps {
    /**
     * Number of displayed columns (used on desktop size)
     */
	columns: 1 | 2 | 3 | 4;
	/**
	 * Define the grid items proportions
	 */
	aspectRatio?: number;
	/**
	 * Tell how an image or video should fit into a grid item
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
	<Box className={`container grid ${getColsClassName(columns)}`} gap={gap} {...rest}>
		{makeArray(children).map((child) => (
			/// ...
		))}
	</Box>
);
```