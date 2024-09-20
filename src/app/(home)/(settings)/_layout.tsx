import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import contentAdd from "./content-add";
import contentView from "./content-view";
import structureAdd from "./structure-add";
import structureView from "./structure-view";

const { Navigator, Screen } = createMaterialTopTabNavigator();

export default function(): React.ReactElement {
	return (
		<Navigator
			screenOptions={{ tabBarLabelStyle: { fontSize: 12 } }}
		>
			<Screen
				name="content-add"
				options={{ title: "Adicionar Conteúdo" }}
				component={contentAdd}
			/>
			<Screen
				name="content-view"
				options={{ title: "Ver Conteúdos" }}
				component={contentView}
			/>
			<Screen
				name="structure-add"
				options={{ title: "Ver Estruturas" }}
				component={structureAdd}
			/>
			<Screen
				name="structure-view"
				options={{ title: "Adicionar Estrutura" }}
				component={structureView}
			/>
		</Navigator>
	);
}
