// src/components/base/Heading.tsx
import { styled, type HTMLStyledProps } from "@styled-system/jsx";
import type { FC } from "hono/jsx";

const headingStyles = {
	sm: { fontSize: "sm", lineHeight: "1rem" },
	md: { fontSize: "md", lineHeight: "1.25rem" },
	lg: { fontSize: "lg", lineHeight: "1.75rem" },
	xl: { fontSize: "xl", lineHeight: "2rem" },
	xxl: { fontSize: "xxl", lineHeight: "2.4rem" }
};

export interface HeadingProps extends HTMLStyledProps<"h1"> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	size?: keyof typeof headingStyles;
}

const HeadingComponent = styled("h1") as FC<HeadingProps>;

export const Heading: FC<HeadingProps> = ({ as = "h2", size = "xl", ...rest }) => (
	<HeadingComponent
		as={as}
		{...headingStyles[size as keyof typeof headingStyles]}
		{...rest}
	/>
);
