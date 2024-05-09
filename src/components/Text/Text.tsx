import {View, Text, TextProps} from 'react-native';
import useThemeColors from '../../constant/useColor';
import {COLORS} from '../../constant/theme';

const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[];
export type ColorType = (typeof colorKeys)[number];

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  title?: boolean;
  h1?: boolean;
  subTitle?: boolean;
  description?: boolean;
  color?: ColorType;
  center?: boolean;
  left?: boolean;
  right?: boolean;
}
export default function CustomText(props: CustomTextProps) {
  const colors = useThemeColors();
  return (
    <Text
      style={{
        textAlign: props.center ? 'center' : props.left ? 'left' : 'left',
        color: props.color ? props.color : colors.text,
        fontSize: props.h1
          ? 35
          : props.title
          ? 24
          : props.subTitle
          ? 12
          : props.description
          ? 12
          : 16,
      }}
      {...props}>
      {props.children}
    </Text>
  );
}
