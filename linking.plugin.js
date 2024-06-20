/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const { withAndroidManifest } = require("@expo/config-plugins");
const withAndroidQueries = config => {
	return withAndroidManifest(config, config => {
		config.modResults.manifest.queries = [
			{
				intent: [
					{
						action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
						data: [{ $: { "android:scheme": "content" } }]
					}
				]
			}
		];

		return config;
	});
};

module.exports = withAndroidQueries;