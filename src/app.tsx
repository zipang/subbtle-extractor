/** @jsxImportSource hono/jsx */
/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */
import { render } from "hono/jsx/dom";
import { Container } from "@components/base/Container";

/**
 * Landing page
 */
function App() {
	return (
		<Container>
			<h1>Bun + Hono/jsx</h1>
			<p>
				Edit <code>src/App.tsx</code> and save to test HMR!
			</p>
		</Container>
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
