import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, useState } from "react";
import { Pressable, useColorScheme } from "react-native";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export type CollapsibleProps = PropsWithChildren & {
	title: string;
};

export default function({ children, title }: CollapsibleProps): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useColorScheme() ?? "light";

	return (
		<ThemedView>
			<Pressable
				className="flex-row items-center gap-2"
				onPress={() => setIsOpen((value) => !value)}
			>
				<Ionicons
					name={isOpen ? "chevron-down" : "chevron-forward-outline"}
					size={18}
					color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
				/>

				<ThemedText
					type="defaultSemiBold"
				>
					{title}
				</ThemedText>
			</Pressable>

			{
				isOpen &&
					<ThemedView
						className="mt-2 ml-6 bg-red-300"
					>
						{children}
					</ThemedView>
			}
		</ThemedView>
	);
}
