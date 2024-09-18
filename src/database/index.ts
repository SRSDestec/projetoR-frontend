import { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_FILENAME = "projetor.db";

const initializer = async (database: SQLiteDatabase): Promise<void> => {
	await database.withTransactionAsync(async (): Promise<void> => {
		// Criação da tabela "Structure"
		await database.execAsync(
			`
			CREATE TABLE IF NOT EXISTS Structure (
				id TEXT PRIMARY KEY NOT NULL,
				name TEXT NOT NULL,
				type TEXT NOT NULL,
				parentId TEXT,
				FOREIGN KEY (parentId) REFERENCES Structure(id)
			);
			`
		);

		// Criação da tabela "Content"
		await database.execAsync(
			`
			CREATE TABLE IF NOT EXISTS Content (
				id TEXT PRIMARY KEY NOT NULL,
				parentId TEXT NOT NULL,
				value TEXT NOT NULL,
				FOREIGN KEY (parentId) REFERENCES Structure(id)
			);
			`
		);
	});
};

export default initializer;
