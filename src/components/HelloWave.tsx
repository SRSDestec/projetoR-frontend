import { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from "react-native-reanimated";
import ThemedText from "@/components/ThemedText";

export default function(): React.ReactElement {
	const REPETITIONS_MOVEMENT = 30;
	const AMOUNT_MOVEMENT = 30;
	const DURATION = 250;
	const rotationAnimation = useSharedValue<number>(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotationAnimation.value}deg` }]
	}));

	useEffect(() => {
		rotationAnimation.value = withRepeat(withSequence(withTiming(AMOUNT_MOVEMENT, { duration: DURATION }), withTiming(0, { duration: DURATION })), REPETITIONS_MOVEMENT);
	}, []);

	return (
		<Animated.View
			style={animatedStyle}
		>
			<ThemedText
				style={{ fontSize: 28, lineHeight: 32, marginTop: -6 }}
			>
				👋
			</ThemedText>
		</Animated.View>
	);
}
