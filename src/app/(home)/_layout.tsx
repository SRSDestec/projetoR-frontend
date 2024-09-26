import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
  
export default function(): React.ReactElement {
	return (
		<Tabs
			initialRouteName="table"
			screenOptions={{ tabBarActiveTintColor: "blue" }}
		>
			<Tabs.Screen
				name="index"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="table"
				options={{
					title: "Início",
					tabBarIcon: ({ color }) =>
						<FontAwesome
							size={28}
							name="home"
							color={color}
						/>
				}}
			/>
			<Tabs.Screen
				name="test"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="(settings)"
				options={{
					title: "Configurações",
					tabBarIcon: ({ color }) => 
						<FontAwesome
							size={28}
							name="cog"
							color={color}
						/>
				}}
			/>
		</Tabs>
	);
}
