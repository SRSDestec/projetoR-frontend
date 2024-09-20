import { Ionicons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View, ViewStyle, useWindowDimensions } from "react-native";
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { DELAY, PADDING } from "@/utils/constants";

type IconIonicons = keyof typeof Ionicons.glyphMap;

type AlertIcon = IconProps<IconIonicons> & AlertIconIonicons;  

type AlertIconIonicons = {
    name: IconIonicons;
    type: "Ionicons";
};

type AlertType = "top" | "bottom";

type AlertTitle = {
    title: string;
};

type AlertRef = {
    ref: React.ForwardedRef<AlertRefMethods>;
};

type AlertMethods = {
    onClick?: () => void;
    onHide?: () => void;
};

export type Alert = {
    description?: string;
    type?: AlertType;
    icon?: AlertIcon;
    duration?: number;
};

export type AlertRefMethods = {
    show: (params: AlertParams) => void;
    hide: () => void;
};

type AlertParams = Alert & AlertTitle;

type AlertProps = (AlertTitle | AlertRef) & Alert & AlertMethods;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default React.forwardRef<AlertRefMethods, AlertProps>(({ onClick, onHide, ...props }, ref) => {
    const HEIGHT = 50;
    const size = useWindowDimensions();
    const [params, setParams] = useState<AlertParams>(() => props as AlertParams);
    const opacity = useSharedValue<number>(0);
    const progressWidth = useSharedValue<number>(size.width - PADDING * 2);
    const positionInitial = params.type === "top" ? -HEIGHT : HEIGHT;
    const positionFinal = params.type === "top" ? PADDING : -PADDING;
    const translateY = useSharedValue<number>(positionInitial);
    const currentDuration = params.duration || 2000;
    const viewStyle: ViewStyle = {
        position: "absolute",
        top: params.type === "top" ? 0 : undefined,
        bottom: params.type !== "top" ? 0 : undefined,
        left: PADDING,
        paddingHorizontal: PADDING,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF", // #CEFACE
        width: size.width - PADDING * 2,
        height: HEIGHT,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    };
    const progressBarStyle: ViewStyle = {
        height: 4,
        backgroundColor: "#2B59E4",
        borderRadius: 2,
        position: "absolute",
        bottom: 0,
        left: 0
    };
    const animatedViewStyle = useAnimatedStyle<ViewStyle>(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }]
        };
    });
    const animatedProgressBarStyle = useAnimatedStyle<ViewStyle>(() => {
        return {
            width: progressWidth.value
       };
    });

    useEffect(() => {
        if (ref && "current" in ref) {
            ref.current = {
                show,
                hide
            };
        }
    }, [ref]);

    function show(params: AlertParams): void {
        setParams({ ...props, ...params });

        opacity.value = withTiming(1, { duration: DELAY });
        translateY.value = withTiming(positionFinal, { duration: DELAY });

        progressWidth.value = size.width - PADDING * 2;
        progressWidth.value = withTiming(0, { duration: currentDuration });

        setTimeout(() => {
            hide();
        }, currentDuration);
    }

    function hide(): void {
        opacity.value = withTiming(0, { duration: DELAY });
        translateY.value = withTiming(positionInitial, { duration: DELAY * 2 });

        if (onHide) {
            onHide();
        }
    };

    function getIcon(value: AlertProps["icon"]): React.ReactElement | null {
		if (value) {
			const { type, color, name } = value as AlertIcon;

			switch (type) {
				case "Ionicons":
					return (
						<Ionicons
							name={name}
							size={26}
							color={color}
						/>
					);
			}
		}

		return null;
    }

    function onClickHandler(): void {
        if (onClick) {
            onClick();
        } else {
            hide();
        }
    }

    if ("title" in params && opacity.value > 0) {
        const { title, description, icon } = params;

		return (
			<AnimatedPressable
				onPress={onClickHandler}
				style={[viewStyle, animatedViewStyle]}
			>
				<View
					style={{ gap: 5, flexDirection: "row" }}
				>
					{getIcon(icon)}
					<View
						style={{ gap: 2, justifyContent: "center" }}
					>
						<Text
							style={{ fontWeight: "500", fontSize: 16, color: "#3F3F46" }}
						>
							{title}
						</Text>
						{
							description && 
								<Text
									numberOfLines={1}
									style={{ fontSize: 12 }}
								>
									{description}
								</Text>
						}
					</View>
				</View>
				<Ionicons
					name="close"
					size={16}
					color="#3F3F46"
					style={{ padding: PADDING * 0.5 }}
					onPress={hide}
				/>
				<Animated.View
					style={[progressBarStyle, animatedProgressBarStyle]}
				/>
			</AnimatedPressable>
        );
    }

    return null;
});
