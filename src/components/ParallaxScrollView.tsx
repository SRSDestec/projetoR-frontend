import type { PropsWithChildren, ReactElement } from "react";
import { useColorScheme } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset} from "react-native-reanimated";
import ThemedView from "@/components/ThemedView";

export type HeaderBackgroundColor = {
	dark: string;
	light: string;
};

type ParallaxScrollViewProps = PropsWithChildren & {
	headerImage: ReactElement;
	headerBackgroundColor: HeaderBackgroundColor;
};

export default function({ children, headerImage, headerBackgroundColor }: ParallaxScrollViewProps): React.ReactElement {
	const HEADER_HEIGHT = 250;
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					)
				},
				{
					scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1])
				}
			]
		};
	});

	return (
		<ThemedView
			className="flex-1"
		>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
			>
				<Animated.View
					className="h-60 overflow-hidden"
					style={[
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle
					]}
				>
					{headerImage}
				</Animated.View>

				<ThemedView
					className="flex-1 p-8 gap-4 overflow-hidden"
				>
					{children}
				</ThemedView>
			</Animated.ScrollView>
		</ThemedView>
	);
}
