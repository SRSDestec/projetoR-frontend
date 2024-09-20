import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { PADDING } from "@/utils/constants";

export default function(): React.ReactElement {
	return (
		<View
			className="items-center justify-center flex-1 bg-red-400"
		>
			<TouchableOpacity
				onPress={() => router.canGoBack() && router.back()}
				style={{ padding: PADDING }}
			>
				<Text>
					Test
				</Text>
			</TouchableOpacity>
		</View>
	);
}
