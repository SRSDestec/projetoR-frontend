export type Content = {
	id: string;
	parentId: string;
	value: string;
};

export type Structure = {
	id: string;
	name: string;
	type: StructureType;
	parentId: string | null;
};

export type StructureType = typeof StructureTypesValue[number];

export const StructureTypesValue = ["string", "number", "boolean", "selected", "node"] as const; 
