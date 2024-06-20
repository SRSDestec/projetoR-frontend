/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/preset");

module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [
		nativewind
	],
	theme: {
		extend: {}
	},
	plugins: []
};
