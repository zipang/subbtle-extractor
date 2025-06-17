import { serve } from "bun";
import { join } from "node:path";
import { publicDir } from "locations";

import home from "./index.html";

// Helper to serve static files from public/
async function serveStaticAsset(req: Request): Promise<Response> {
	// Remove query string and decode URI
	const url = new URL(req.url);
	const pathname = decodeURIComponent(url.pathname);

	// Check the file path inside public/
	const assetPath = join(publicDir, pathname);

	try {
		const file = Bun.file(assetPath);
		if (await file.exists()) {
			// Bun will set the correct Content-Type automatically
			return new Response(file);
		}
	} catch (e) {
		// Ignore and go through to fallback
	}

	return new Response("Not Found", { status: 404 });
}

const server = serve({
	routes: {
		// Serve index.html
		"/": home,

		"/api/hello": {
			async GET(req) {
				return Response.json({
					message: "Hello, world!",
					method: "GET"
				});
			},
			async PUT(req) {
				return Response.json({
					message: "Hello, world!",
					method: "PUT"
				});
			}
		}

		// "/api/hello/:name": async req => {
		//   const name = req.params.name;
		//   return Response.json({
		//     message: `Hello, ${name}!`,
		//   });
		// },
	},

	fetch: (req: Request) => serveStaticAsset(req),

	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true
	}
});

console.log(`🚀 Server running at ${server.url}`);
