import React from "react";
import { View, ImageBackground, TouchableOpacity, Text, useWindowDimensions } from "react-native";

export type AmountSquares = {
	x: number;
	y: number;
};

export type GridProps = {
	backgroundImage: string;
	squares: AmountSquares;
	onSquarePress: (x: number, y: number) => void;
};

export default function({ backgroundImage, squares, onSquarePress }: GridProps): React.ReactElement {
	const { width } = useWindowDimensions();
	const { x, y } = squares;
	const squareSize = width / x;

	function renderGrid(): JSX.Element[] {
		const squares = [];

		for (let row = 0; row < y; row++) {
			for (let col = 0; col < x; col++) {
				squares.push(
					<TouchableOpacity
						key={`${col}-${row}`}
						className="items-center justify-center border border-black"
						style={{ width: squareSize, height: squareSize }}
						onPress={() => onSquarePress(col, row)}
					>
						<Text
							className="font-bold text-white"
						>
							{`(${col}, ${row})`}
						</Text>
					</TouchableOpacity>
				);
			}
		}

		return squares;
	};

	return (
		<ImageBackground
			source={{ uri: backgroundImage }}
			className="items-center justify-center flex-1"
		>
			<View
				className="flex flex-row flex-wrap"
				style={{ width: width, height: squareSize * y }}
			>
				{renderGrid()}
			</View>
		</ImageBackground>
	);
};
