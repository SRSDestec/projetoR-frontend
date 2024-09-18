
// eslint-disable-next-line no-undef, no-restricted-syntax, @typescript-eslint/typedef, @typescript-eslint/explicit-function-return-type
module.exports = function(api) {
	api.cache(true);

	return {
		presets: [
			[
				"@babel/preset-env",
				{
					targets: {
						node: "current"
					}
				}
			],
			[
				"babel-preset-expo",
				{
					jsxImportSource: "nativewind"
				}
			],
      		"nativewind/babel",
			"@babel/preset-typescript"
		],
		plugins: [
		// 	[
		// 		"@babel/plugin-proposal-decorators",
		// 		{
		// 			legacy: true
		// 		}
		// 	],
		// 	"@babel/plugin-syntax-jsx",
		// 	"@babel/transform-react-jsx-source",
		// 	"babel-plugin-transform-typescript-metadata"
			"react-native-reanimated/plugin"
		]
	};
};
