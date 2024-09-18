import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function(): React.ReactElement {
	return (
		<View
			className="items-center justify-center flex-1 bg-red-400"
		>
			<Link
				href=".."
			>
				<Text>
					Test
				</Text>
			</Link>
		</View>
	);
}
