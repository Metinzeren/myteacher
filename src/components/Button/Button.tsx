import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';

import useThemeColors from '../../constant/useColor';
import { SIZES } from '../../constant/theme';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import CustomText from '../Text/Text';

interface OutlineButtonProps extends TouchableOpacityProps {
  icon?: IconProp;
  outline?: boolean;
  loading?: boolean;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  size?: 'sm' | 'md';
}

export default function Button({
  icon,
  outline = false,
  loading,
  text,
  textColor,
  backgroundColor,
  borderRadius = SIZES.radius_sm,
  size = 'md',
  ...props
}: OutlineButtonProps) {
  const colors = useThemeColors();
  var lockPressed = false;
  return (
    <CustomButton
      style={props.style}
      onPress={event => {
        if (loading) {
          return true;
        }
        if (props.disabled) {
          return;
        }
        if (lockPressed) {
          return;
        }
        lockPressed = true;
        setTimeout(() => {
          lockPressed = false;
        }, 1000);
        props.onPress && props.onPress(event);
      }}
      activeOpacity={props.activeOpacity || 0.7}
      theme={{
        size: size,
        borderRadius: borderRadius,
        borderColor: props.disabled ? "#ddd" : loading ? '#ddd' : backgroundColor || colors.primary,
        backgroundColor: props.disabled ? colors.grey : outline
          ? 'transparent'
          : loading
            ? '#ddd'
            : backgroundColor || colors.primary,
      }}>
      {icon && <IconLeft icon={icon} color={colors.text} />}
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <ButtonText
          theme={{
            color: props.disabled ? "#ddd" : outline ? colors.primary : textColor || colors.text,
          }}>
          {text}
        </ButtonText>
      )}
    </CustomButton>
  );
}

const IconLeft = styled(FontAwesomeIcon)`
  margin-right: 0px;
`;
const CustomButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.backgroundColor};
  padding: ${props => (props.theme.size === 'sm' ? '5px' : '10px')};
  border-radius: ${props => props.theme.borderRadius}px;
  border-width: 1px;
  height: ${props => (props.theme.size === 'sm' ? '30px' : '50px')};
  border-color: ${props => props.theme.borderColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled(CustomText)`
  color: ${props => props.theme.color};
  font-size: ${SIZES.fontSm}px;
  font-weight: bold;
`;
