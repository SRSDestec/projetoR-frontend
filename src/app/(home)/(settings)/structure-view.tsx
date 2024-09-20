import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import Modal, { ModalRefMethods } from "@/components/modal";
import { Structure } from "@/database/types";
import { PADDING } from "@/utils/constants";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const modalRef = useRef<ModalRefMethods>(null);
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

	async function deleteData(structure: Structure): Promise<void> {
		const { id } = structure;

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

	async function copyData(structure: Structure): Promise<void> {
		try {
			await Clipboard.setStringAsync(JSON.stringify(structure, null, 4));
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

	function onClickItem(item: Structure): void {
		modalRef.current?.show({
			data: [
				{
					icon: "copy",
					text: "Copiar dados",
					action: async (): Promise<void> => await copyData(item)
				},
				{
					icon: "trash",
					text: "Apagar",
					action: async (): Promise<void> => await deleteData(item)
				}
			]
		});
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
				onPress={() => onClickItem(item)}
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
		<>
			<View
				className="flex-1"
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
				<FlatList
					data={listStructures}
					showsVerticalScrollIndicator={false}
					keyExtractor={x => x.id}
					renderItem={({ item }) => componentItem(item)}
					ItemSeparatorComponent={componentSeparator}
					contentContainerStyle={{ paddingHorizontal: PADDING, paddingBottom: PADDING }}
					ListEmptyComponent={componentEmpty}
				/>
			</View>

			<Modal 
				ref={modalRef}
			/>
		</>
	);
}
