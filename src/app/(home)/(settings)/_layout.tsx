import { MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions, createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from "react";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator);

// Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()
export default function(): React.ReactElement {
	return (
		<MaterialTopTabs
			screenOptions={{ tabBarLabelStyle: { fontSize: 12 } }}
		>
			<MaterialTopTabs.Screen
				name="content-add"
				options={{ title: "Adicionar Conteúdo" }}
			/>
			<MaterialTopTabs.Screen
				name="content-view"
				options={{ title: "Ver Conteúdos" }}
			/>
			<MaterialTopTabs.Screen
				name="structure-add"
				options={{ title: "Ver Estruturas" }}
			/>
			<MaterialTopTabs.Screen
				name="structure-view"
				options={{ title: "Adicionar Estrutura" }}
			/>
		</MaterialTopTabs>
	);
}
