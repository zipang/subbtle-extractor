import { Box, type BoxProps } from "./Box";

export const defaultVstackProps = {
	display: "flex",
	flexDirection: "column",
	gap: 10,
	alignItems: "center",
	justifyContent: "center"
} as BoxProps;

/**
 * Vertically stack child elements
 * @param props
 */
export const VStack = (props: BoxProps) => {
	return <Box {...defaultVstackProps} {...props} />;
};
