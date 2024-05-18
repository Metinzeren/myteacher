import { View, Text, TextProps, StyleProp, TextStyle } from 'react-native';
import useThemeColors from '../../constant/useColor';
import { COLORS, FONTSIZES } from '../../constant/theme';
import { ColorType, FontSizeType } from '../../types/type';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  fontSizes?: FontSizeType;
  description?: boolean;
  color?: ColorType;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  sx?: StyleProp<TextStyle>;
  borderTop?: boolean;
  borderColor?:ColorType;
}

export default function CustomText(props: CustomTextProps) {
  const colors = useThemeColors();
  return (
    <Text
      style={[
        props.sx,
        {
          textAlign: props.center ? 'center' : props.left ? 'left' : 'left',
          color: props.color ? COLORS[props.color] : colors.text,
          fontSize: props.fontSizes ? FONTSIZES[props.fontSizes] : FONTSIZES.default,
          borderTopWidth: props.borderTop ? 1 : 0,
          borderColor: props.borderColor ? COLORS[props.borderColor] || colors.text : 'transparent', 
        },
      ]}
      {...props}>
      {props.children}
    </Text>
  );
}
