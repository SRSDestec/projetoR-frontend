import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

type CheckboxProps = {
	label: string;
	value: boolean;
	setValue: (value: boolean) => void;
};

export default function Checkbox({ label, value, setValue }: CheckboxProps): React.ReactElement {
	return (
		<TouchableOpacity
			onPress={() => setValue(!value)}
			style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}
		>
			<View
				style={{ width: 24, height: 24, marginRight: 4 }}
			>
				<FontAwesome
					name={value ? "check-square" : "square-o"}
					size={value ? 24 : 26}
					color={value ? "#1E90FF" : "#CCCCCC"}
				/>
			</View>
			<Text
				style={{ marginBottom: 3, fontSize: 16, color: "#333333" }}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
};
