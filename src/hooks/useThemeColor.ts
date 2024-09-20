/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { useColorScheme } from "react-native";
import { Colors } from "@/utils/constants";

type ThemeColor = {
	light?: string;
	dark?: string;
};

// eslint-disable-next-line import/prefer-default-export
export function useThemeColor(props: ThemeColor, colorName: keyof typeof Colors.light): string {
	const theme = useColorScheme() ?? "light";
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}
