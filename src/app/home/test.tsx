import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function(): React.ReactElement {
	return (
		<View
			className="items-center justify-center flex-1 bg-red-400"
		>
			<TouchableOpacity
				onPress={() => router.canGoBack() && router.back()}
				onLongPress={() => void router.push("/home/content/add")}
				style={{ padding: 10 }}
			>
				<Text>
					Test
				</Text>
			</TouchableOpacity>
		</View>
	);
}
