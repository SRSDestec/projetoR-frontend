import "../globals.css";
import "reflect-metadata";
import "react-native-reanimated";
import "react-native-safe-area-context";
import "react-native-get-random-values";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function(): React.ReactElement | null {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
	});

	useEffect(() => {
		if (loaded) {
			void SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (loaded) {
		return (
			<ThemeProvider
				value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
			>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
	
					<Stack.Screen
						name="+not-found"
					/>
				</Stack>
			</ThemeProvider>
		);
	}

	return null;
}
