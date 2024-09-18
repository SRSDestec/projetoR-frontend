import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function(): React.ReactElement {
	return (
		<View
			className="items-center justify-center flex-1 gap-2"
		>
			<TouchableOpacity
				onPress={() => router.push("(home)/test")}
				onLongPress={() => void router.push("(home)/add")}
				style={{ padding: 10 }}
			>
				<Text>
					dlroW olleH
				</Text>
			</TouchableOpacity>
		</View>
	);
}
