import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

import useThemeColors from '../../constant/useColor';
import {SIZES} from '../../constant/theme';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import CustomText from '../Text/Text';

interface OutlineButtonProps extends TouchableOpacityProps {
  icon?: IconProp;
  outline?: boolean;
  loading?: boolean;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

export default function Button({
  icon,
  outline = false,
  loading,
  text,
  textColor,
  backgroundColor,
  borderRadius = SIZES.radius_lg,
  ...props
}: OutlineButtonProps) {
  const colors = useThemeColors();
  var lockPressed = false;
  return (
    <CustomButton
      onPress={event => {
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
        borderRadius: borderRadius,
        borderColor: backgroundColor || colors.primary,
        backgroundColor: outline
          ? 'transparent'
          : backgroundColor || colors.primary,
      }}>
      {icon && <IconLeft icon={icon} color={colors.text} />}
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <ButtonText
          theme={{
            color: textColor || colors.text,
          }}>
          {text}
        </ButtonText>
      )}
    </CustomButton>
  );
}

const IconLeft = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
const CustomButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.backgroundColor};
  padding: 10px;
  border-radius: ${props => props.theme.borderRadius}px;
  min-width: 150px;
  border-width: 1px;
  height: 45px;
  border-color: ${props => props.theme.borderColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled(CustomText)`
  color: ${props => props.theme.color};
  font-size: ${SIZES.font}px;
  font-weight: bold;
`;
