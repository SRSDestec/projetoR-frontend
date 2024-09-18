import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

type Function = () => void;

type ListenerFocusProps = {
	onFocus: Function;
	onUnfocus: Function;
};

export default function({ onFocus, onUnfocus }: Partial<ListenerFocusProps>): void {

	useFocusEffect(
		useCallback(() => {
            if (onFocus) {
			    onFocus();
            }
			
			return (): void => {
                if (onUnfocus) {
                    onUnfocus();
                }
		  	};
		}, [])
	);
}
