import * as Clipboard from "expo-clipboard";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Structure } from "@/database/types";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const [listStructures, setListStructures] = useState<Structure[]>([]);

	useEffect(() => {
		void getData();
	}, []);

	async function getData(): Promise<void> {
		try {
			const response = await database.getAllAsync<Structure>("SELECT * FROM Structure");

			setListStructures(response);
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	function deleteData(structure: Structure): void {
		const { id, name } = structure;

		Alert.alert("Excluir", `Deseja realmente excluir a estrutura "${name}"?`, [	
			{
				text: "Cancelar",
				style: "cancel"
			},
			{
				text: "Excluir",
				style: "destructive",
				onPress: async (): Promise<void> => {
					await database.withTransactionAsync(async (): Promise<void> => {
						try {
							await database.execAsync(`DELETE FROM Structure WHERE id = "${id}"`);
							await getData();
						}
						catch (error) {
							// eslint-disable-next-line no-console
							console.error(error);
							Alert.alert("Erro", "Falha ao excluir a estrutura.");
						}
					});
				}
			}
		]);
	}

	async function copyData(structure: Structure): Promise<void> {
		try {
			await Clipboard.setStringAsync(JSON.stringify(structure, null, 4));
	
			Alert.alert("Sucesso", "Estrutura copiada com sucesso.");
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	function componentItem(item: Structure): React.ReactElement {
		const { id, name, type, parentId } = item;

		return (
			<TouchableOpacity
				onPress={() => void copyData(item)}
				onLongPress={() => deleteData(item)}
			>
				<View>
					<Text>
						{`ID: ${id}`}
					</Text>

					<Text>
						{`Nome: ${name}`}
					</Text>

					<Text>
						{`Tipo: ${type}`}
					</Text>

					<Text>
						{`Parent ID: ${parentId || "Nenhum"}`}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	function componentSeparator(): React.ReactElement {
		return (
			<View
				style={{ height: 1, backgroundColor: "#CCCCCC", marginVertical: 5 }}
			/>
		);
	}

	return (
		<View
			style={{ padding: 20 }}
		>
			<Text
				style={{ fontSize: 20, marginBottom: 10 }}
			>
				Estruturas Salvas
			</Text>

			<FlatList
				data={listStructures}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => componentItem(item)}
				ItemSeparatorComponent={componentSeparator}
			/>
		</View>
	);
}
