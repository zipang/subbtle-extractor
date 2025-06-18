/** @jsxImportSource hono/jsx */
/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */
import { render } from "hono/jsx/dom";
import { Container } from "@components/base/Container";
import { VideoSelector } from "@components/ui/VideoSelector";
import { AspectRatio, Box, Grid, HStack, Spacer } from "@components/base";

/**
 * Landing page
 */
function App() {
	return (
		<Box as="main">
			<HStack as="header" padding="2rem" justifyContent="space-between">
				<h1>Bun + Hono/jsx</h1>
				<p>
					Edit <code>src/app.tsx</code> and save to test HMR!
				</p>
			</HStack>
			<Box as="section" height="50vh">
				<Container>
					<Grid columns={2} gap="4rem">
						<VideoSelector />
						<AspectRatio ratio={4 / 3}>
							<canvas width="100%" height="100%" />
						</AspectRatio>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}

const rootElement = document.getElementById("app");
if (rootElement) {
	if (import.meta.hot) {
		// With hot module reloading, `import.meta.hot.data` is persisted.
		import.meta.hot.data.root ??= rootElement;
	}

	render(<App />, rootElement);
}
