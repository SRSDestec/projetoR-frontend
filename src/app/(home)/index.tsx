import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { PADDING } from "@/utils/constants";

export default function(): React.ReactElement {
	return (
		<View
			className="items-center justify-center flex-1"
		>
			<TouchableOpacity
				onPress={() => router.push("/(home)/test")}
				style={{ padding: PADDING }}
			>
				<Text>
					dlroW olleH
				</Text>
			</TouchableOpacity>
		</View>
	);
}
