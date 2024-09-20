import { Ionicons } from "@expo/vector-icons";
import React, { useImperativeHandle, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Modal from "react-native-modal";

type ItemModal = {
	icon: keyof typeof Ionicons.glyphMap;
	text: string;
	action: () => void;
};

type ModalContentData = {
	data: ItemModal[];
};

type ModalContentChildren = {
	children: React.ReactNode;
};

type ModalContent = ModalContentData | ModalContentChildren;

type ModalProps = Partial<ModalContent> & {
	onClose?: () => void;
};

export type ModalRefMethods = {
	show: (content?: ModalContent) => void;
	hide: () => void;
};

export default React.forwardRef<ModalRefMethods, ModalProps>(({ onClose, ...props }: ModalProps, ref) => {
	const [content, setContent] = useState<ModalContent | null>(() => {
		const children = "children" in props ? props.children : null;
		const data = "data" in props ? props.data : null;

		return children || data ? { children, data } : null;
	});

	useImperativeHandle<ModalRefMethods, ModalRefMethods>(ref, () => {
		return {
			show: (content?: ModalContent): void => setContent(content || null),
			hide: (): void => onCloseHandler()
		};
	});

	function renderItem({ item }: { item: ItemModal }): React.ReactElement {
		return (
			<TouchableOpacity
				onPress={item.action}
			>
				<View
					className="flex-row items-center mb-2"
				>
					<Ionicons
						name={item.icon}
						size={24}
						className="mr-2"
					/>
					<Text>
						{item.text}
					</Text>
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

	function onCloseHandler(): void {
		setContent(null);

		if (onClose) {
			onClose();
		}
	}

	function component(content: React.ReactNode): React.ReactElement {
		return (
			<Modal
				isVisible={content !== null}
				onBackdropPress={onCloseHandler}
				onSwipeComplete={onCloseHandler}
				animationIn="fadeIn"
				animationOut="fadeOut"
				backdropOpacity={0.5}
			>
				<View
					className="pt-1 bg-white shadow-lg rounded-xl"
				>
					<View
						className="flex-row items-center justify-between mx-2 mb-4"
					>
						<View />
						<View
							className="w-28 h-1.5 bg-gray-300 rounded-full"
						/>
						<TouchableOpacity
							onPress={onCloseHandler}
						>
							<Ionicons
								name="close"
								size={28}
								color="#333333"
							/>
						</TouchableOpacity>
					</View>
					<View
						className="px-3"
					>
						{content}
					</View>
				</View>
			</Modal>
		);
	}

	if (content) {
		if ("children" in content) {
			const { children } = content;

			return (component(children));
		}

		if ("data" in content) {
			const { data } = content;

			if (data.length > 0) {
				const value = (
					<FlatList
						data={data}
						renderItem={renderItem}
						ItemSeparatorComponent={componentSeparator}
						keyExtractor={x => x.text}
						className="mb-4"
					/>
				);

				return (component(value));
			}
		}
	}

	return null;
});
