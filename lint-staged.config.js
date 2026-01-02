export default {
	// TypeScript, JavaScript, JSX, TSX files
	'*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}': ['biome check --write --no-errors-on-unmatched'],

	// JSON files
	'*.json': ['biome check --write --no-errors-on-unmatched'],

	// Markdown files (only format, no lint)
	'*.md': ['biome format --write --no-errors-on-unmatched'],
};
