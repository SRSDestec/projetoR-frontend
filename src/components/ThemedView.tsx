import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
	lightColor?: string;
	darkColor?: string;
};

export default function({ className, style, lightColor, darkColor, ...otherProps }: ThemedViewProps): React.ReactElement {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

	return (
		<View
			className={className}
			style={[{ backgroundColor }, style]}
			{...otherProps}
		/>
	);
}
