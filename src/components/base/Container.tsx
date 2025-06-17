import type { FC, PropsWithChildren } from "react";

import "./container-styles.css";

/**
 * Responsive centered content with width optimized for readibility (75ch)
 */
export const Container: FC<PropsWithChildren> = ({ children }) => (
	<div className="container">{children}</div>
);
