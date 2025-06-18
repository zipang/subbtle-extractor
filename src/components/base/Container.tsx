import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

export interface ContainerProps {
	fluid?: boolean;
	className?: string;
}
/**
 * Responsive centered content with width optimized for readibility (75ch)
 */
export const Container: FC<PropsWithChildren<ContainerProps>> = ({
	children,
	className,
	fluid = false,
	...rest
}) => (
	<div
		className={clsx({ container: !fluid }, { "container-fluid": !!fluid }, className)}
		{...rest}
	>
		{children}
	</div>
);
