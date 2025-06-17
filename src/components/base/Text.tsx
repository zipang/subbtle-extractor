// src/components/base/Text.tsx
import type { FC, PropsWithChildren } from "react";
import type { BoxProps } from "./Box";

export interface TextProps extends Omit<BoxProps, "as"> {
	as?: "p" | "em" | "strong" | "span" | "label";
}

export const Text: FC<PropsWithChildren<TextProps>> = ({
	children,
	as = "p",
	...rest
}) => {
	const Component = as;

	// Extract only style-related props for the style attribute
	return <Component style={{ ...rest }}>{children}</Component>;
};
