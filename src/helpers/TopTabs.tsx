import { createMaterialTopTabNavigator, MaterialTopTabBar, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/routers";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

type MapRouters = {
	routeNames: string[];
	index: number;
};

type CustomScreenOptions = {
    excludeScreens: string[];
    titleScreens: Record<string, string>;
};

export const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions & Partial<CustomScreenOptions>, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator, (options) => {
	return options.filter(x => !x.name || ( x.options && "excludeScreens" in x.options && !x.options?.excludeScreens?.includes(x.name)));
});

export function TopTabs({ screenOptions, ...props }: TopTabsProps): JSX.Element {
	const excludeScreens = typeof screenOptions === "object" ? screenOptions.excludeScreens : undefined;

	return (
		<MaterialTopTabs
			screenOptions={({ route }) => ({
                title: screenOptions?.titleScreens?.[route.name] ?? route.name
            })}
			tabBar={({ state, descriptors, ...tabBarProps }) => {
				if (!excludeScreens || excludeScreens.length === 0) {
					return (
						<MaterialTopTabBar
							state={state}
							descriptors={descriptors}
							{...tabBarProps}
						/>
					);
				}
		
				const { index, routeNames } = excludeScreensAndAdjustIndex(state.routeNames, excludeScreens, state.index);
				const routes = state.routes.filter(x => !excludeScreens.includes(x.name));
				const stateWithoutExcludedScreens = {
					...state,
					index,
					routeNames,
					routes
				};
		
				return (
					<MaterialTopTabBar
						state={stateWithoutExcludedScreens}
						descriptors={descriptors}
						{...tabBarProps}
					/>
				);
			}}
			{...props}
		/>
	);
}

export type TopTabsProps = Omit<Parameters<typeof MaterialTopTabs>[0], "screenOptions"> & {
	screenOptions?: MaterialTopTabNavigationOptions & Partial<CustomScreenOptions>
}

export function excludeScreensAndAdjustIndex(allRouteNames: string[], excludeScreens: string[], requestedIndex: number): MapRouters {
	// routeNames = [screen1, screen2, screen3, screen4, screen5]
	// index = 0, 1, 2, 3, 4
	// given excludedScreens = [screen2, screen4]
	// iteration 1: indexMap = { 0: 0 }
	// iteration 2: indexMap = { 0: 0, 1: 0 }
	// iteration 3: indexMap = { 0: 0, 1: 0, 2: 1 }
	// iteration 4: indexMap = { 0: 0, 1: 0, 2: 1, 3: 1 }
	// iteration 5: indexMap = { 0: 0, 1: 0, 2: 1, 3: 1, 4: 2 }
	// though indexMap 1 and 3 should never be called upon as their corresponding tabs aren't accessible through the interface
	let prevIndex = 0;
	const indexMap: Record<number, number> = {};
	const routeNames = allRouteNames.filter((x, i) => {
		const isExcluded = excludeScreens.includes(x);

		indexMap[i] = prevIndex;

		if (!isExcluded) {
			prevIndex += 1;
		}

		return !isExcluded;
	});
  
	return {
		routeNames,
		index: indexMap[requestedIndex]
	};
}
