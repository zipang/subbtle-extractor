/** @jsxImportSource hono/jsx */
import type { FC, Child } from "hono/jsx/dom";
import clsx from "clsx";

export interface ContainerProps {
	children: Child;
	fluid?: boolean;
	className?: string;
}
/**
 * Responsive centered content with width optimized for readibility (75ch)
 */
export const Container: FC<ContainerProps> = ({ children, className, fluid = false }) => (
	<div
		className={clsx({ container: !fluid }, { "container-fluid": !!fluid }, className)}
	>
		{children}
	</div>
);
