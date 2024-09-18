import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, UIManager, LayoutAnimation, StyleSheet, ScrollView } from "react-native";

export type TreeNode<T> = T & {
	children: TreeNode<T>[];
};

export type TreeViewProps<T> = {
  data: T[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onFilter?: (item: T) => boolean;
  getId: (item: T) => string;
  getName: (item: T) => string;
  getDescription?: (item: T) => string;
  getParentId: (item: T) => string | null;
  canSelect?: (item: T) => boolean;
  canDeselect?: boolean;
  renderNode?: (item: T, selectedId: string | null) => JSX.Element;
};

export default function<T>({ data, selectedId, onSelect, onFilter, getId, getName, getDescription, getParentId, canSelect, canDeselect, renderNode }: TreeViewProps<T>): JSX.Element {
	const [listNodes, setListNodes] = useState<TreeNode<T>[]>([]);
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

	useEffect(() => {
		const hierarchicalData = buildTree(data);

		setListNodes(hierarchicalData);
		setExpandedNodes(new Set());
	}, [data]);

	function buildTree(flatData: T[]): TreeNode<T>[] {
		const tree: TreeNode<T>[] = [];
		const mapper = new Map<string, TreeNode<T>>();
	
		flatData.forEach(item => {
			const id = getId(item);

			if (!mapper.has(id)) {
				mapper.set(id, { ...item, children: [] });
			}
		});
	
		// Atribuir filhos aos seus respectivos pais
		flatData.forEach(item => {
			const parentId = getParentId(item);
			const node = mapper.get(getId(item));

			if (node) {
				if (parentId) {
					const parentNode = mapper.get(parentId);

					if (parentNode) {
						parentNode.children.push(node);
					} else {
						// Se o pai não for encontrado, tratar como raiz
						tree.push(node);
					}
				} else {
					tree.push(node);
				}
			}
		});
	
		return tree;
	};
	
	function toggleExpand(id: string): void  {
		const newExpandedNodes = new Set(expandedNodes);

	   	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		if (newExpandedNodes.has(id)) {
			newExpandedNodes.delete(id);
	   	} else {
		 	newExpandedNodes.add(id);
	   	}

	   	setExpandedNodes(newExpandedNodes);
	};

	// Habilitar LayoutAnimation no Android
	if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	function renderTree(nodes: TreeNode<T>[], level: number): (JSX.Element | null)[] {
		return nodes.map((node) => {
			const nodeId = getId(node);
			const nodeName = getName(node);
			const nodeDescription = getDescription ? getDescription(node) : null;
			const isExpanded = expandedNodes.has(nodeId);
			const hasChildren = node.children && node.children.filter(x => !onFilter || onFilter(x)).length > 0; 

			if (onFilter && !onFilter(node)) {
				return null;
			}

			return (
				<View
					key={nodeId}
					style={{ marginBottom: 5 }}
				>
					<View
						style={[styles.nodeContainer, { marginLeft: level * 20 }]}
					>
						{
							hasChildren ?
								<TouchableOpacity
									onPress={() => toggleExpand(nodeId)}
									style={styles.iconContainer}
								>
									<Ionicons
										name={isExpanded ? "chevron-down" : "chevron-forward"}
										size={16}
										color="#555555"
									/>
								</TouchableOpacity>
							:
								<View
									style={styles.iconContainer}
								/>
						}

						{
							(!canSelect || canSelect(node)) &&
								<TouchableOpacity
									onPress={() => onSelect(canDeselect !== false && selectedId === nodeId ? null : nodeId)}
									style={styles.labelContainer}
								>
									{
										renderNode ?
											renderNode(node, selectedId)
										:
											<Text
												style={[styles.nodeText, selectedId === nodeId && styles.selectedNodeText]}
											>
												{`${nodeName} `}
												{
													nodeDescription && !hasChildren &&
														<Text
															style={{ fontStyle: "italic", fontSize: 12 }}
														>
															({nodeDescription})
														</Text>
												}
											</Text>
									}
								</TouchableOpacity>
						}
					</View>

					{
						hasChildren && isExpanded &&
							renderTree(node.children, level + 1)
					}
				</View>
			);
		});
	}

	return (
		<>
			{
				listNodes.length > 0 ?
					<ScrollView
						style={{ flexGrow: 1 }}
						showsVerticalScrollIndicator={false}
					>
						{renderTree(listNodes, 0)}
					</ScrollView>
				:
					<Text
						style={{ fontStyle: "italic", fontSize: 12 }}
					>
						Não existem nenhum valor.
					</Text>
			}
		</>
	);
}

const styles = StyleSheet.create({
	nodeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5
	},
	iconContainer: {
		width: 26,
		height: 26,
		alignItems: "flex-end",
		justifyContent: "center"
	},
	labelContainer: {
		flex: 1
	},
	nodeText: {
		fontSize: 16,
		color: "#333333"
	},
	selectedNodeText: {
		fontWeight: "bold",
		color: "#1E90FF"
	}
});
