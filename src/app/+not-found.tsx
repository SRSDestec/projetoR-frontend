import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function(): React.ReactElement {
	return (
		<>
			<Stack.Screen
				options={{ title: "Oops!" }}
			/>

			<View
				className="items-center justify-center flex-1 p-5"
			>
				<Text>
					{"This screen doesn't exist."}
				</Text>

				<Link
					href="(home)/index"
					className="px-4 mt-4"
				>
					<Text>
						Go to home screen!
					</Text>
				</Link>
			</View>
		</>
	);
}
