import * as Clipboard from "expo-clipboard";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Content } from "@/database/types";

export default function(): React.ReactElement {
	const PADDING = 20;
	const database = useSQLiteContext();
	const [listContents, setListContents] = useState<Content[]>([]);

	useEffect(() => {
		void getData();
	}, []);

	async function getData(): Promise<void> {
		try {
			const response = await database.getAllAsync<Content>("SELECT * FROM Content");

			setListContents(response);
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	function deleteData(content: Content): void {
		const { id, value } = content;

		Alert.alert("Excluir", `Deseja realmente excluir o conteúdo "${value}"?`, [	
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
							await database.execAsync(`DELETE FROM Content WHERE id = "${id}"`);
							await getData();
						}
						catch (error) {
							// eslint-disable-next-line no-console
							console.error(error);
							Alert.alert("Erro", "Falha ao excluir o conteúdo.");
						}
					});
				}
			}
		]);
	}

	async function copyData(content: Content): Promise<void> {
		try {
			await Clipboard.setStringAsync(JSON.stringify(content, null, 4));
	
			Alert.alert("Sucesso", "Conteúdo copiado com sucesso.",
				[
					{
						text: "OK",
						style: "default"
					}
				],
				{
					cancelable: true
				}
			);
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	function generateTreeViewString(nodes: Record<string, unknown>[], indent: string): string {
		let result = "";
	
		nodes.forEach((node, index) => {
			const isLastNode = index === nodes.length - 1;
			const branch = isLastNode ? "└── " : "├── ";
			const name = node.name as string;
			const type = node.type as string;
			const nodeString = `${indent}${branch}${name} (${type})\n`;
	
			result += nodeString;
	
			const children = node.children as Record<string, unknown>[];
			if (children && children.length > 0) {
				const newIndent = isLastNode ? `${indent}    ` : `${indent}│   `;
				result += generateTreeViewString(children, newIndent);
			}
		});
	
		return result;
	}

	function componentItem(item: Content): React.ReactElement {
		const { id, parentId, value, createdAt, updatedAt } = item;
		const customCreatedAt = new Date(createdAt).toLocaleString();
		const customUpdatedAt = updatedAt ? new Date(updatedAt).toLocaleString() : "Nenhum";
		const listRows: Record<string, string> = {
			"ID": id,
			"Parent ID": parentId || "Nenhum",
			"Valor": value,
			"Criado em": customCreatedAt,
			"Atualizado em": customUpdatedAt
		};

		return (
			<TouchableOpacity
				onPress={() => void copyData(item)}
				onLongPress={() => deleteData(item)}
			>
				<View>
					{
						Object.entries(listRows).map(([x, y]) => {
							return (
								<Text
									key={x}
									className="font-bold"
								>
									{`${x}: `}
									<Text
										className="font-normal"
									>
										{y}
									</Text>
								</Text>
							);
						})
					}
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

	function componentEmpty(): React.ReactElement {
		return (
			<View
				style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: PADDING }}
			>
				<Text
					style={{ fontStyle: "italic", fontSize: 12 }}
				>
					Nenhum conteúdo salvo.
				</Text>
			</View>
		);
	}

	return (
		<View
			className="flex-1"
			style={{ marginTop: PADDING + 5 }}
		>
			<View
				className="justify-center items-center py-2 bg-[#1E90FF]"
			>
				<Text
					style={{ fontSize: 20, color: "#FFFFFF" }}
				>
					Conteúdos
				</Text>
			</View>

			<View
				style={{ paddingHorizontal: PADDING, paddingBottom: PADDING }}
			>
				<FlatList
					data={listContents}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => componentItem(item)}
					ItemSeparatorComponent={componentSeparator}
					contentContainerStyle={{ paddingBottom: PADDING * 2 }}
					ListEmptyComponent={componentEmpty}
				/>
			</View>
		</View>
	);
}
