import { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_FILENAME = "projetor.db";

async function initializer(database: SQLiteDatabase, attempt: number): Promise<void> {
	try {
		await database.withTransactionAsync(async (): Promise<void> => {
			// Criação da tabela "Structure"
			await database.execAsync(
				`
				CREATE TABLE IF NOT EXISTS Structure (
					id TEXT PRIMARY KEY NOT NULL,
					name TEXT NOT NULL,
					type TEXT NOT NULL,
					parentId TEXT,
					createdAt TEXT NOT NULL,
					updatedAt TEXT,
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
					createdAt TEXT NOT NULL,
					updatedAt TEXT,
					FOREIGN KEY (parentId) REFERENCES Structure(id)
				);
				`
			);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);

		if (attempt < 2) {
			await database.execAsync("DROP TABLE IF EXISTS Structure");
			await database.execAsync("DROP TABLE IF EXISTS Content");

			await initializer(database, attempt + 1);
		}
	}
};

export default initializer;
