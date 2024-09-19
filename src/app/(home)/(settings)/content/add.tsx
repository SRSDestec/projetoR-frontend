import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "@/components/check-box";
import InputField from "@/components/input-field";
import TreeView from "@/components/tree-view";
import { Content, Structure } from "@/database/types";
import useListenerFocus from "@/hooks/useListenerFocus";

export default function(): React.ReactElement {
	const database = useSQLiteContext();
	const [listStructures, setListStructures] = useState<Structure[]>([]);
	const [listContents, setListContents] = useState<Content[]>([]); 
	const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
	const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
	const selectedStructure = useMemo(() => listStructures.find(x => x.id === selectedStructureId), [listStructures, selectedStructureId]);

	useListenerFocus({
		onFocus: (): void => {
			void getData();
		}
	});

	useEffect(() => {
		if (selectedStructureId) {
			const listStructuresFiltered = listStructures.filter(x => x.parentId === selectedStructureId && x.type !== "node");
			const listContentsFiltered = listContents.filter(x => listStructuresFiltered.some(p => p.id === x.parentId));

			listContentsFiltered.forEach(x => {
				setFormData(p => ({ ...p, [x.parentId]: x.value }));
			});
		}
	}, [selectedStructureId]);

	async function getData(): Promise<void> {
		try {
			const responseStructures = await database.getAllAsync<Structure>("SELECT * FROM Structure");

			setListStructures(responseStructures);
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}

		try {
			const responseContents = await database.getAllAsync<Content>("SELECT * FROM Content");

			setListContents(responseContents);
		}
		catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}
	
	function renderFields(parentNode: Structure): JSX.Element { 
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
										value={value === "True"}
										setValue={x => setFormData({ ...formData, [id]: x ? "True" : "False" })}
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
		const statementInsert = await database.prepareAsync(
			`
			INSERT INTO Content (id, parentId, value, createdAt, updatedAt)
			VALUES ($id, $parentId, $value, $createdAt, $updatedAt)
			ON CONFLICT(parentId)
			DO UPDATE SET
				value = $value,
				updatedAt = $createdAt;
			`
		);

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
		setSelectedStructureId(null);
		
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
			className="justify-between flex-1 px-5 pb-5"
		>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
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
					href="/content/view"
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
