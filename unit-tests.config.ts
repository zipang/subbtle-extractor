/**
 * Configuration to help LLM Agents generate consistent Unit tests
 */
const testsConfig = {
	// 1. Test framework
	framework: "bun",

	// 2. Test file location: same directory as source file
	testFileLocation: "same-directory",

	// 3. Naming convention: .spec.ts extension, same filename as source
	testFilePattern: "{filename}.spec.ts",

	// 4. Each public class/interface gets its own describe() block
	describePer: "public-class-or-interface",

	// 7. Each method should be tested with multiple 'it' blocks as needed,
	// using the pattern: methodName() should [do something] when [condition]
	itBlockPattern: "{methodName}() should {behavior} when {condition}",

	// Additional conventions (can be extended as needed)
	language: "typescript",
	importStatement: "import { describe, it, expect } from 'bun:test';",
	autoImportSource: true, // Automatically import the class under test
	autoImportUtils: []
};

export default testsConfig;
