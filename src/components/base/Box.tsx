import type { FC, Child } from "hono/jsx/dom";

/**
 * Basic styling via style attributes
 * All major box-related style properties are included for flexibility.
 */
export interface StyledAttrProps {
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

	// Cursor & Pointer
	cursor?:
		| "auto"
		| "default"
		| "pointer"
		| "wait"
		| "text"
		| "move"
		| "not-allowed"
		| "crosshair"
		| "grab"
		| "grabbing"
		| "help"
		| "progress"
		| "cell"
		| "context-menu"
		| "alias"
		| "copy"
		| "no-drop"
		| "none"
		| "zoom-in"
		| "zoom-out";
	pointerEvents?: "auto" | "none" | "inherit" | "initial" | "unset";

	// Opacity
	opacity?: number;

	// Others
	transition?: string;
	visibility?: "visible" | "hidden" | "collapse" | "inherit" | "initial" | "unset";
	outline?: string;
}

export interface BoxProps extends StyledAttrProps {
	children: Child;

	as?: "div" | "section" | "aside" | "main" | "header" | "footer" | "nav";
	className?: string;
}

interface FinalProps {
	children: Child;
	className?: string;
	role?: string;
	"aria-label"?: string;
	tabIndex?: number;
	style?: Partial<Record<keyof StyledAttrProps, any>>;
}

const STANDARD_PROPS = ["className", "tabIndex", "role", "aria-label"];

const extractStandardProps = (propertyBag: Record<string, any>) => {
	const standard = {} as FinalProps;
	Object.keys(propertyBag).forEach((propName) => {
		if (STANDARD_PROPS.indexOf(propName) >= 0 || propName.startsWith("on")) {
			// @ts-ignore
			standard[propName] = propertyBag[propName];
			delete propertyBag[propName];
		}
	});
	return standard;
};

export const Box: FC<BoxProps> = ({ children, as = "div", ...rest }) => {
	const Component = as;

	const props = extractStandardProps(rest) as FinalProps;

	// We add style to resume all Box props
	if (Object.keys(rest).length > 0) props.style = { ...rest };

	// Extract only style-related props for the style attribute
	// (You may want to filter out non-style props if you add more in the future)
	return <Component {...props}>{children}</Component>;
};
