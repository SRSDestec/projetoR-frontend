import { Link, Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";

export default function(): React.ReactElement {
	return (
		<>
			<Stack.Screen
				options={{ title: "Oops!" }}
			/>

			<ThemedView
				className="flex-1 justify-center items-center p-5"
			>
				<ThemedText
					type="title"
				>
					{"This screen doesn't exist."}
				</ThemedText>

				<Link
					href="/"
					className="mt-4 px-4"
				>
					<ThemedText
						type="link"
					>
						Go to home screen!
					</ThemedText>
				</Link>
			</ThemedView>
		</>
	);
}
