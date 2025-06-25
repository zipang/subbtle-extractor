// src/components/base/Text.tsx
import type { FC, Child } from "hono/jsx/dom";
import type { StyledAttrProps } from "./Box";

export interface TextProps extends StyledAttrProps {
	children: Child;
	as?: "p" | "em" | "strong" | "span" | "label";
	className?: string;
}

export const Text: FC<TextProps> = ({ children, as = "p", ...rest }) => {
	const Component = as;

	// Extract only style-related props for the style attribute
	return <Component style={{ ...rest }}>{children}</Component>;
};
