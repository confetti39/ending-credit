import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

export interface TextProps extends RNTextProps {
  variant?:
    | "heading1"
    | "heading2"
    | "heading3"
    | "body1"
    | "body2"
    | "caption";
  weight?: "regular" | "medium" | "bold";
  color?: string;
}

const fontFamilies = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  bold: "Pretendard-Bold",
};

export function Text({
  style,
  variant = "body1",
  weight,
  color = "black",
  ...props
}: TextProps) {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "heading1":
        return { fontSize: 24, lineHeight: 32 };
      case "heading2":
        return { fontSize: 20, lineHeight: 28 };
      case "heading3":
        return { fontSize: 18, lineHeight: 26 };
      case "body1":
        return { fontSize: 16, lineHeight: 24 };
      case "body2":
        return { fontSize: 14, lineHeight: 20 };
      case "caption":
        return { fontSize: 12, lineHeight: 16 };
      default:
        return {};
    }
  };

  const getWeightStyle = (): TextStyle => {
    // If weight is explicitly provided, use it
    if (weight) {
      return { fontFamily: fontFamilies[weight] };
    }

    // Default weights for variants
    switch (variant) {
      case "heading1":
      case "heading2":
      case "heading3":
        return { fontFamily: fontFamilies.bold };
      default:
        return { fontFamily: fontFamilies.regular };
    }
  };

  return (
    <RNText
      style={[{ color }, getVariantStyle(), getWeightStyle(), style]}
      {...props}
    />
  );
}
