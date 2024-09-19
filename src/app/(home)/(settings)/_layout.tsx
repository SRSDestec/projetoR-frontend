import { TopTabs } from "@/helpers/TopTabs";

export default function(): React.ReactElement {
	const listExcludeScreens = [
		"content/view",
		"structure/view"
	];
	const listTitleScreens = {
		"content/add": "Conteúdos",
		"structure/add": "Estruturas"
	};

	return (
		<TopTabs
			screenOptions={{
				excludeScreens: listExcludeScreens,
				titleScreens: listTitleScreens
			}}
		/>
	);
}
