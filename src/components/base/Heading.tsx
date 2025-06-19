// src/components/base/Heading.tsx
import type { FC, Child } from "hono/jsx/dom";
import type { StyledAttrProps } from "./Box";

type heading_tag = "h1" | "h2" | "h3";

const headingStyles = {
	sm: { fontSize: "1rem", lineHeight: "1.1" },
	md: { fontSize: "1.25rem", lineHeight: "1.2" },
	lg: { fontSize: "1.5rem", lineHeight: "1.5" },
	xl: { fontSize: "1.75rem", lineHeight: "1.5" },
	xxl: { fontSize: "2rem", lineHeight: "1.2" },
	"4xl": { fontSize: "4rem", lineHeight: "1.1" }
};

const defaultSizes: Record<heading_tag, keyof typeof headingStyles> = {
	h1: "xxl",
	h2: "xl",
	h3: "lg"
};

export interface HeadingProps extends StyledAttrProps {
	children: Child;
	as?: "h1" | "h2" | "h3";
	size?: keyof typeof headingStyles;
}

export const Heading: FC<HeadingProps> = ({ as = "h2", size, ...rest }) => {
	const Component = as;
	if (!size) {
		size = defaultSizes[as];
	}

	return <Component {...headingStyles[size as keyof typeof headingStyles]} {...rest} />;
};
