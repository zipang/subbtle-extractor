import { Box, type BoxProps } from "./Box";
import "./spacer-styles.css";

/**
 * Push other elements around in a flex container like HStack and VStack
 * @param props
 */
export const Spacer = (props: BoxProps) => {
	return <Box className="spacer" {...props} />;
};
