import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import TreeView from "@/components/tree-view";
import { Structure, StructureType, StructureTypesValue } from "@/database/types";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const [name, setName] = useState<string>("");
	const [type, setType] = useState<StructureType | null>(null);
	const [parentId, setParentId] = useState<string | null>(null);
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

	async function saveData(): Promise<void> {
		const existingStructure = listStructures.find(x => x.name.toLowerCase() === name.toLowerCase());

		if (existingStructure) {
			Alert.alert("Erro", "Já existe uma estrutura com esse nome.");

			return;
		}

		const id = uuidv4();
		const statement = await database.prepareAsync("INSERT INTO Structure (id, name, type, parentId) VALUES ($id, $name, $type, $parentId)");

		try {
			await statement.executeAsync({
				"$id": id,
				"$name": name,
				"$type": type,
				"$parentId": parentId || null
			});
			await getData();

			setName("");
			setType(null);
			setParentId(null);

			Alert.alert("Sucesso", "Estrutura salva com sucesso.");
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			Alert.alert("Erro", "Falha ao salvar os dados.");
		}
		finally {
			await statement.finalizeAsync();
		}
	}

	return (
		<View
			className="justify-between flex-1 p-5 mt-5"
		>
			<View>
				<Text>
					Nome:
				</Text>

				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Digite o nome"
					style={{ borderBottomWidth: 1, marginBottom: 10 }}
				/>

				<Text>
					Tipo:
				</Text>

				<Picker
					selectedValue={type || undefined}
					onValueChange={(itemValue: StructureType) => setType(itemValue)}
					style={{ height: 50, width: "100%", marginBottom: 20 }}
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

				{
					listStructures.length > 0 ?
						<TreeView
							data={listStructures}
							selectedId={parentId}
							onSelect={setParentId}
							getId={x => x.id}
							getName={x => x.name}
							getDescription={x => x.type}
							getParentId={x => x.parentId}
							canDeselect={true}
							// canSelect={x => x.type !== "node"}
						/>
					:
						<Text>Carregando estruturas...</Text>
				}
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
					href="(home)/view"
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
