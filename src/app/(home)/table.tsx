import { View } from "react-native";
import Grid from "@/components/grid";

export default function(): React.ReactElement {
	return (
		<View
			className="flex-1"
		>
			<Grid
				backgroundImage="https://runefoundry.com/cdn/shop/products/ForestEncampment_digital_day_grid.jpg"
				squares={{ x: 10, y: 15 }}
			/>
		</View>
	);
}
