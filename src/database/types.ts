type Data = {
	id: string;
	createdAt: string;
	updatedAt: string | null;
};

export type Content = Data & {
	parentId: string;
	value: string;
};

export type Structure = Data & {
	name: string;
	type: StructureType;
	parentId: string | null;
};

export type StructureType = typeof StructureTypesValue[number];

export const StructureTypesValue = ["string", "number", "boolean", "selected", "node"] as const; 
