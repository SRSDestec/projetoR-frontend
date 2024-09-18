import "../globals.css";
import "reflect-metadata";
import "react-native-reanimated";
import "react-native-get-random-values";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SpaceMonoFont from "@/assets/fonts/SpaceMono-Regular.ttf";
import initializer, { DATABASE_FILENAME } from "@/database";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function(): React.ReactElement | null {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({ SpaceMono: SpaceMonoFont });

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
				<SQLiteProvider
					databaseName={DATABASE_FILENAME}
					onInit={initializer}
				>
					<SafeAreaProvider>

						<Stack
							screenOptions={{ headerShown: false }}
						>
							<Stack.Screen
								name="(home)/index"
							/>
							
							<Stack.Screen
								name="(home)/test"
							/>
			
							<Stack.Screen
								name="+not-found"
							/>
							
						</Stack>
					</SafeAreaProvider>
				</SQLiteProvider>
			</ThemeProvider>
		);
	}

	return null;
}
