import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import useListenerFocus from "@/hooks/useListenerFocus";

export default function(): React.ReactElement {

	useListenerFocus({
		onFocus: (): void => {
			if (__DEV__) {
				router.push("/home/content/add");
			}
		}
	});

	return (
		<View
			className="items-center justify-center flex-1"
		>
			<Text>
				{"This screen doesn't exist."}
			</Text>

			<Link
				href="/home"
				className="px-4 mt-4"
			>
				<Text>
					Go to home screen!
				</Text>
			</Link>
		</View>
	);
}
