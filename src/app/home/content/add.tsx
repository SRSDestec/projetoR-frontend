import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo, useState } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "@/components/check-box";
import InputField from "@/components/input-field";
import TreeView from "@/components/tree-view";
import { Structure } from "@/database/types";
import useListenerFocus from "@/hooks/useListenerFocus";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const [listStructures, setListStructures] = useState<Structure[]>([]);
	const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
	const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
	const selectedStructure = useMemo(() => listStructures.find(x => x.id === selectedStructureId), [listStructures, selectedStructureId]);

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
	
	function renderFields (parentNode: Structure): JSX.Element { 
		const children = listStructures.filter(x => x.parentId === parentNode.id && x.type !== "node");

		return (
			<View
				style={{ marginTop: 20 }}
			>
				{
					children.map(x => {
						const { id, name, type } = x;
						const value = String(formData[id] || "");

						switch (type) {
							case "string":
								return (
									<InputField
										key={id}
										title={name}
										value={value}
										setValue={x => setFormData({ ...formData, [id]: x })}
									/>
								);
							case "number":
								return (
									<InputField
										key={id}
										title={name}
										value={value}
										setValue={x => setFormData({ ...formData, [id]: typeof x === "string" ? parseFloat(x) : x })}
									/>
								);
							case "boolean":
								return (
									<Checkbox
										key={id}
										label={name}
										value={Boolean(value)}
										setValue={x => setFormData({ ...formData, [id]: Boolean(x) })}
									/>
								);
							default:
								return null;
						}
					})
				}
			</View>
		);
	}

	async function saveData(): Promise<void> {
		const statementInsert = await database.prepareAsync("INSERT INTO Content (id, parentId, value, createdAt, updatedAt) VALUES ($id, $parentId, $value, $createdAt, $updatedAt)");

		for (const [key, value] of Object.entries(formData)) {
			const id = uuidv4();

			try {
				await statementInsert.executeAsync({
					"$id": id,
					"$parentId": key,
					"$value": value,
					"$createdAt": new Date().toISOString(),
					"$updatedAt": null
				});
			}
			catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		}

		await statementInsert.finalizeAsync();
		await getData();

		setFormData({});
		
		Alert.alert("Sucesso", "Conteúdo salvo com sucesso.",
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

	return (
		<View
			className="justify-between flex-1 p-5 mt-5"
		>
			<ScrollView
				contentContainerStyle={{ padding: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<Text>
					Selecione uma Estrutura:
				</Text>
				<TreeView
					data={listStructures}
					selectedId={selectedStructureId}
					onSelect={setSelectedStructureId}
					onFilter={x => x.type === "node"}
					getId={x => x.id}
					getName={x => x.name}
					getParentId={x => x.parentId}
					canDeselect={true}
				/>

				{
					selectedStructure &&
						renderFields(selectedStructure)
				}
			</ScrollView>

			<View
				className="gap-2"
			>
				<Button
					title="Salvar"
					disabled={selectedStructure === undefined}
					onPress={saveData}
				/>

				<Link
					href="/home/content/view"
					asChild={true}
				>
					<Button
						title="Ver Conteúdos"
					/>
				</Link>
			</View>
		</View>

	);
}
