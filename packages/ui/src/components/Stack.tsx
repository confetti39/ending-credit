import React from "react";
import {
  View,
  ViewProps,
  ViewStyle,
  DimensionValue,
  FlexAlignType,
  FlexStyle,
} from "react-native";

export type StackProps = ViewProps &
  Pick<
    ViewStyle,
    | "width"
    | "maxWidth"
    | "minWidth"
    | "height"
    | "maxHeight"
    | "minHeight"
    | "alignItems"
    | "justifyContent"
    | "borderRadius"
    | "borderColor"
    | "borderWidth"
    | "alignSelf"
    | "backgroundColor"
    | "flex"
    | "position"
    | "gap"
    | "top"
    | "bottom"
    | "left"
    | "right"
  > & {
    // Padding
    p?: DimensionValue;
    pt?: DimensionValue;
    pb?: DimensionValue;
    pl?: DimensionValue;
    pr?: DimensionValue;
    px?: DimensionValue;
    py?: DimensionValue;

    // Margin
    m?: DimensionValue;
    mt?: DimensionValue;
    mb?: DimensionValue;
    ml?: DimensionValue;
    mr?: DimensionValue;
    mx?: DimensionValue;
    my?: DimensionValue;
  };

const getStackStyle = (props: StackProps): ViewStyle => {
  const style: ViewStyle = {};

  if (props.gap != null) style.gap = props.gap;

  if (props.p != null) style.padding = props.p;
  if (props.pt != null) style.paddingTop = props.pt;
  if (props.pb != null) style.paddingBottom = props.pb;
  if (props.pl != null) style.paddingLeft = props.pl;
  if (props.pr != null) style.paddingRight = props.pr;
  if (props.px != null) style.paddingHorizontal = props.px;
  if (props.py != null) style.paddingVertical = props.py;

  if (props.m != null) style.margin = props.m;
  if (props.mt != null) style.marginTop = props.mt;
  if (props.mb != null) style.marginBottom = props.mb;
  if (props.ml != null) style.marginLeft = props.ml;
  if (props.mr != null) style.marginRight = props.mr;
  if (props.mx != null) style.marginHorizontal = props.mx;
  if (props.my != null) style.marginVertical = props.my;

  if (props.alignItems != null) style.alignItems = props.alignItems;
  if (props.justifyContent != null) style.justifyContent = props.justifyContent;
  if (props.alignSelf != null) style.alignSelf = props.alignSelf;
  if (props.flex != null) style.flex = props.flex;
  if (props.position != null) style.position = props.position;

  if (props.borderRadius != null) style.borderRadius = props.borderRadius;
  if (props.borderColor != null) style.borderColor = props.borderColor;
  if (props.borderWidth != null) style.borderWidth = props.borderWidth;
  if (props.backgroundColor != null)
    style.backgroundColor = props.backgroundColor;

  if (props.width != null) style.width = props.width;
  if (props.minWidth != null) style.minWidth = props.minWidth;
  if (props.maxWidth != null) style.maxWidth = props.maxWidth;

  if (props.height != null) style.height = props.height;
  if (props.minHeight != null) style.minHeight = props.minHeight;
  if (props.maxHeight != null) style.maxHeight = props.maxHeight;

  if (props.top != null) style.top = props.top;
  if (props.bottom != null) style.bottom = props.bottom;
  if (props.left != null) style.left = props.left;
  if (props.right != null) style.right = props.right;

  return style;
};

export function HStack({ style, ...props }: StackProps) {
  return (
    <View
      style={[{ flexDirection: "row" }, getStackStyle(props), style]}
      {...props}
    />
  );
}

export function VStack({ style, ...props }: StackProps) {
  return (
    <View
      style={[{ flexDirection: "column" }, getStackStyle(props), style]}
      {...props}
    />
  );
}
