# A Guide to writing UI Component

## 1. Hono/jsx

We use `hono/jsx` which is 90% similar to React in term of API.
See the section **# Clients Components** inside the [what-is-hono](/what-is-hono.md) guide.

## 2. Common imports
- import `FC` and `Child` types from `"hono/jsx/dom"`.
- import base components from `@components/base`.
- import utility functions from `@utils`.
- import local stylesheets using the component's class name.

## 3. Component props
- Type as functional components with TypeScript interface (`FC<Props>`).
- Define a dedicated `MyComponentProps` interface for each component (using the component's name).
- Document each prop with a JSDoc comment, including its default value if needed.
- Export both the component and its props interface.

## 4. Styling

- We are relying on a tweaked [Pico.css](https://picocss.com) stylesheet for the big picture (`src/index.css`). Global style choices should be achieved by tweaking the [Pico.css variables](https://picocss.com/docs/css-variables)
- For component specific qtyles, use a local CSS file named after the component's name (e.g., `<component>-styles.css`).
- Link this stylesheet inside the component. `import <component>-styles.css;`

## 5. Base UI components

- All layout components are placed inside a dedicated directory : `@components/base`.
- All layout should be achieved by re-using these components : `<Box>, <Container>, <HStack>, <VStack>, <Grid>, <Spacer>, <Header>, <Footer>`.
- Additional dynamic styles can be added on these base components via style attributes (like in Chakra UI). 
  Here is the list of attributes exported by the interface `BoxProps` : 

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

## 6. Component Logic
- Extract helper functions for logic (e.g., `getColsClassName`).
- Reuseable helper functions like array or color manipulation should be placed inside the shared `src/utils/` directory.

## 8. Accessibility
- Ensure all components are accessible by default. 
- Use key shortcuts to activate component's actions. Ex: "Space" to play/pause, "Enter" to validate the current entry..
- Use _semantic_ HTML elements via the base components `as` attribute (e.g. `<Box as="aside">`) .

## 9. Documentation
- Document the component and its props using a JSDoc header.
- Include a description of the component's purpose and usage.

# Example

This is an example of a typical component using this style guide

```tsx
import type { FC, Child } from "hono/jsx";
import { AspectRatio, Box, type BoxProps } from "@components/base";
import { makeArray } from "@utils/array-utils";

// Local styles linked to our `.grid` class name
import "./grid-styles.css";

/**
 * Add a specific classname to indicate the number of columns
 */
const getColsClassName = (cols: number) => {
    return ["", "one-column", "two-columns", "three-columns", "four-columns"][cols]
}

/**
 * HOC Utility to wrap an element inside an AspectRatio
 */
const aspectRatioWrapper = (aspectRatio: number | undefined, imageFit) => ({ children: Child }) => { ... }

export interface GridProps extends BoxProps {
    children?: Child;
    /**
     * Number of displayed columns (used on desktop size)
     * @default 3
     */
	columns: 1 | 2 | 3 | 4;
	/**
	 * Define the grid items proportions
	 */
	aspectRatio?: number;
	/**
	 * Tell how an image or video should fit inside a grid item
     * @default "cover"
	 */
	imageFit?: "cover" | "fill" | "contain";
}

/**
 * A grid with same-sized grid items
 * If `aspectRatio` is passed, Every child is wrapped inside an AspectRatio component
 */
export const Grid: FC<GridProps> = ({
	columns = 3,
	gap = "2rem",
	imageFit = "cover",
	aspectRatio,
	children = [],
	...rest
}) => (
	<Box className={`grid ${getColsClassName(columns)}`} gap={gap} {...rest}>
		{makeArray(children).map(aspectRatioWrapper(aspectRatio, imageFit))}
	</Box>
);
```