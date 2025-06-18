import { PurgeCSS } from "purgecss";

const purgeCSSResult = await new PurgeCSS().purge({
	content: ["dist/*.html"],
	css: ["dist/*.css"]
});

for (const { file, css } of purgeCSSResult) {
	if (file) {
		await Bun.file(file)
			.write(css)
			.then((size) => {
				console.log(`File ${file} rewritten with ${size}bytes`);
			});
	}
}
