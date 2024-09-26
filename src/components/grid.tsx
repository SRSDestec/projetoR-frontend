import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, ImageBackground, TouchableOpacity, FlatList, Text, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type GridItem = {
	icon: keyof typeof Ionicons.glyphMap;
	text: string;
	action: () => void;
};

export type GridProps = {
	backgroundImage: string;
	squares: Position;
	data?: GridItem[];
};

export type Position = {
	x: number;
	y: number;
};

export default function({ squares, backgroundImage, data }: GridProps): React.ReactElement {
	const { x, y } = squares;
	const { width, height } = useWindowDimensions();
	const squareSize = 50;
	const gridWidth = x * squareSize;
	const gridHeight = y * squareSize;

	const scale = useSharedValue(1);
	const savedScale = useSharedValue<number>(1);
	const moveCurrentPosition = useSharedValue<Position>({ x: 0, y: 0 });
	const moveStartPosition = useSharedValue<Position>({ x: 0, y: 0 });

	const scaleGesture = Gesture.Pinch()
		.onUpdate(event => {
			scale.value = savedScale.value * event.scale;
		})
		.onEnd(() => {
			savedScale.value = scale.value;
		});
 
	const dragGesture = Gesture.Pan()
		.averageTouches(true)
		.onUpdate(e => {
			// const dragFactor = Math.min(1, Math.pow(scale.value, 2.5));
			// const adjustedTranslationX = e.translationX / dragFactor;
			// const adjustedTranslationY = e.translationY / dragFactor;

			// moveCurrentPosition.value = {
			// 	x: adjustedTranslationX + moveStartPosition.value.x,
			// 	y: adjustedTranslationY + moveStartPosition.value.y
			// };

			moveCurrentPosition.value = {
				x: e.translationX + moveStartPosition.value.x,
				y: e.translationY + moveStartPosition.value.y
			};
		})
		.onEnd(() => {
			moveStartPosition.value = {
				x: moveCurrentPosition.value.x,
				y: moveCurrentPosition.value.y
			};
		});
	const composed = Gesture.Simultaneous(dragGesture, scaleGesture);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ translateX: moveCurrentPosition.value.x },
			{ translateY: moveCurrentPosition.value.y }
		]
	}));

	function renderItem({ item }: { item: GridItem }): React.ReactElement {
		return (
			<TouchableOpacity
				className="flex-row items-center p-2"
				onPress={() => item.action()}
			>
				<Ionicons
					className="mr-2"
					name={item.icon}
					size={24}
					color="#333"
				/>
				<Text
					className="text-gray-700"
				>
					{item.text}
				</Text>
			</TouchableOpacity>
		);
	}

	function componentSeparator(): React.ReactElement {
		return (
			<View
				className="h-px bg-gray-300"
			/>
		);
	}

	return (
		<GestureHandlerRootView
			className="flex-1"
		>
			<GestureDetector
				gesture={composed}
			>
				<Animated.View
					className="flex-1"
				>
					<Animated.View
						style={[{ width: gridWidth, height: gridHeight }, animatedStyle]}
					>
						<ImageBackground
							source={{ uri: backgroundImage }}
							style={{ width: "100%", height: "100%" }}
							resizeMode="cover"
						>
							<View
								style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
							>
								{
									Array.from({ length:  x * y }).map((u, i) => {
										const indexRow = Math.floor(i / x);
										const indexColumn = i % x;
										const positionX = indexColumn * squareSize;
										const positionY = indexRow * squareSize;

										return (
											<TouchableOpacity
												key={`square-${i}`}
												style={{ width: squareSize, height: squareSize, borderWidth: 1, borderColor: "#ccc", backgroundColor: "transparent", position: "absolute", top: positionY, left: positionX }}
												// eslint-disable-next-line no-console
												onPress={() => console.log({ x: indexColumn + 1, y: indexRow + 1 })}
											/>
										);
									})
								}
							</View>
							{
								data && data.length > 0 &&
									<FlatList
										data={data}
										renderItem={renderItem}
										ItemSeparatorComponent={componentSeparator}
										keyExtractor={x => x.text}
										contentContainerStyle={{ padding: 10 }}
										style={{ flex: 1 }}
									/>
							}
						</ImageBackground>
					</Animated.View>
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};
