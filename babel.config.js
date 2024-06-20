
// eslint-disable-next-line no-restricted-syntax, @typescript-eslint/typedef, @typescript-eslint/explicit-function-return-type
module.exports = function(api) {
	api.cache(true);
	
	return {
		presets: [
			[
				"babel-preset-expo", {
					jsxImportSource: "nativewind"
				}
			],
			"nativewind/babel"
		],
		plugins: [
			[
				"@babel/plugin-proposal-decorators",
				{
					legacy: true
				}
			],
			"@babel/transform-react-jsx-source",
			"babel-plugin-transform-typescript-metadata",
			"react-native-reanimated/plugin"
		]
	};
};
