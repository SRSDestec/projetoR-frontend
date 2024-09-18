import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Structure } from "@/database/types";

export default function(): React.ReactElement {
	const PADDING = 20;
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
	
			Alert.alert("Sucesso", "Estrutura copiada com sucesso.",
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

	function buildTree(structures: Structure[], parentId: string | null): Record<string, unknown>[] {
		const listStructuresFiltered = structures.filter(x => x.parentId === parentId);
		const listTreeData = listStructuresFiltered.map(x => {
			return {
				name: x.name,
				type: x.type,
				children: buildTree(structures, x.id)
			};
		});

		return listTreeData;
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

	// Função para copiar os dados da árvore formatados para a área de transferência
	async function copyTreeNodeData(): Promise<void> {
		try {
			const treeNodeData = buildTree(listStructures, null);
			const treeViewString = generateTreeViewString(treeNodeData, "");
			
			// Copia a string gerada para a área de transferência
			await Clipboard.setStringAsync(treeViewString);

			Alert.alert("Sucesso", "Dados da árvore copiados para a área de transferência!",
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

	function componentItem(item: Structure): React.ReactElement {
		const { id, name, type, parentId, createdAt, updatedAt } = item;
		const customCreatedAt = new Date(createdAt).toLocaleString();
		const customUpdatedAt = updatedAt ? new Date(updatedAt).toLocaleString() : "Nenhum";
		const listRows: Record<string, string> = {
			"ID": id,
			"Nome": name,
			"Tipo": type,
			"Parent ID": parentId || "Nenhum",
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
					Nenhuma estrutura salva.
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
				className="flex-row justify-center items-center gap-2 py-2 bg-[#1E90FF]"
			>
				<Text
					style={{ fontSize: 20, color: "#FFFFFF" }}
				>
					Estruturas
				</Text>
				<TouchableOpacity
					onPress={() => void copyTreeNodeData()}
				>
					<FontAwesome5
						name="copy"
						size={18}
						color="#FFFFFF"
					/>
				</TouchableOpacity>
			</View>

			<View
				style={{ paddingHorizontal: PADDING, paddingBottom: PADDING }}
			>
				<FlatList
					data={listStructures}
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
