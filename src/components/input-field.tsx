import React, { useState } from "react";
import { View, Text, TextInput, ViewProps } from "react-native";

type InputFieldValue = string | number | boolean;

type InputFieldProps = Omit<ViewProps, "children"> & {
  title: string;
  value: InputFieldValue | undefined;
  setValue?: (value: InputFieldValue) => void;
};

export default function({ title, value, setValue, ...props }: InputFieldProps): React.ReactElement {
	const [focus, setFocus] = useState<boolean>(false);

	function onChangeValue(value: InputFieldValue): void {
		if (setValue) {
			setValue(value);
		}
	};

	return (
		<View
			className="my-0.5"
			{...props}
		>
			<Text
				className="text-sm ml-2 mb-0.5 text-[#333333]"
			>
				{title}
			</Text>
			<TextInput
				className="rounded-md px-4 py-2 border-[1px]"
				keyboardType="default"
				value={value !== undefined ? String(value) : ""}
				style={{ borderColor: focus ? "#1E90FF" : "#CCCCCC" }}
				onChangeText={onChangeValue}
				onFocus={(): void => setFocus(true)}
				onBlur={(): void => setFocus(false)}
			/>
		</View>
	);
};
