import * as Clipboard from "expo-clipboard";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import Modal, { ModalRefMethods } from "@/components/modal";
import { Content } from "@/database/types";
import { PADDING } from "@/utils/constants";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const modalRef = useRef<ModalRefMethods>(null);
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

	async function deleteData(content: Content): Promise<void> {
		const { id } = content;

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

	async function copyData(content: Content): Promise<void> {
		try {
			await Clipboard.setStringAsync(JSON.stringify(content, null, 4));
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}

	function onClickItem(item: Content): void {
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
					Nenhum conteúdo salvo.
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
						keyExtractor={x => x.id}
						renderItem={({ item }) => componentItem(item)}
						ItemSeparatorComponent={componentSeparator}
						contentContainerStyle={{ paddingHorizontal: PADDING, paddingBottom: PADDING }}
						ListEmptyComponent={componentEmpty}
					/>
				</View>
			</View>

			<Modal
				ref={modalRef}
			/>
		</>
	);
}
