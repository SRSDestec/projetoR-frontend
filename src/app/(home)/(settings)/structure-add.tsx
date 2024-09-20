import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import TreeView from "@/components/tree-view";
import { Structure, StructureType, StructureTypesValue } from "@/database/types";
import useListenerFocus from "@/hooks/useListenerFocus";
import { PADDING } from "@/utils/constants";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const [name, setName] = useState<string>("");
	const [type, setType] = useState<StructureType | null>(null);
	const [parentId, setParentId] = useState<string | null>(null);
	const [listStructures, setListStructures] = useState<Structure[]>([]);

	useListenerFocus({
		onFocus: (): void => {
			void getData();
		}
	});

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

	async function saveData(): Promise<void> {
		const existingStructure = listStructures.find(x => x.name.toLowerCase() === name.toLowerCase());

		if (existingStructure) {
			Alert.alert("Erro", "Já existe uma estrutura com esse nome.");

			return;
		}

		const id = uuidv4();
		const statementInsert = await database.prepareAsync("INSERT INTO Structure (id, name, type, parentId, createdAt, updatedAt) VALUES ($id, $name, $type, $parentId, $createdAt, $updatedAt)");

		try {
			await statementInsert.executeAsync({
				"$id": id,
				"$name": name,
				"$type": type,
				"$parentId": parentId || null,
				"$createdAt": new Date().toISOString(),
				"$updatedAt": null
			});

			if (parentId) {
				const structureParent = await database.getFirstAsync<Structure>("SELECT * FROM Structure WHERE id = $parentId", { $parentId: parentId || null });

				if (structureParent && structureParent?.type !== "node") {
					const statementUpdate = await database.prepareAsync("UPDATE Structure SET type = $type, updatedAt = $updatedAt WHERE id = $id");

					try {
						await statementUpdate.executeAsync({
							"$id": parentId,
							"$type": "node",
							"$updatedAt": new Date().toISOString()
						});
					}
					catch (error) {
						// eslint-disable-next-line no-console
						console.error(error);
						Alert.alert("Erro", "Falha ao atualizar os dados da estrutura pai.");
					}
					finally {
						await statementUpdate.finalizeAsync();
					}
				}
			}

			await getData();

			setName("");
			setType(null);
			setParentId(null);

			Alert.alert("Sucesso", "Estrutura salva com sucesso.",
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
			Alert.alert("Erro", "Falha ao salvar os dados.");
		}
		finally {
			await statementInsert.finalizeAsync();
		}
	}

	return (
		<View
			className="justify-between flex-1"
			style={{ padding: PADDING }}
		>
			<View
				className="flex-1 mt-1"
			>
				<Text>
					Nome:
				</Text>
				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Digite o nome"
					style={{ borderBottomWidth: 1, marginBottom: PADDING }}
				/>

				<Text>
					Tipo:
				</Text>
				<Picker
					selectedValue={type || undefined}
					onValueChange={setType}
					style={{ height: 50, width: "100%", marginBottom: PADDING * 2 }}
				>
					{
						type === null &&
							<Picker.Item
								label={"Selecione"}
								value={-1}
							/>
					}
					{
						StructureTypesValue.map(x => {
							const label = x.charAt(0).toUpperCase() + x.slice(1);

							return (
								<Picker.Item
									key={x}
									label={label}
									value={x}
								/>
							);
						})
					}
				</Picker>

				<Text>
					{"Parent ID "}
					<Text
						style={{ fontStyle: "italic" }}
					>
						(opcional)
					</Text>
					:
				</Text>
				<TreeView
					data={listStructures}
					selectedId={parentId}
					onSelect={setParentId}
					getId={x => x.id}
					getName={x => x.name}
					getDescription={x => x.type}
					getParentId={x => x.parentId}
					canDeselect={true}
				/>
			</View>

			<View
				className="gap-2"
			>
				<Button
					title="Salvar"
					onPress={saveData}
					disabled={!name || !type}
				/>

				<Link
					href="/structure-view"
					asChild={true}
				>
					<Button
						title="Ver Estruturas"
					/>
				</Link>
			</View>
		</View>
	);
}
