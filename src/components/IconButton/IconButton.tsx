import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SIZES } from '../../constant/theme';
import styled from 'styled-components';
import useThemeColors from '../../constant/useColor';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface IconButtonProps extends TouchableOpacityProps {
  icon: IconProp;
  outline?: boolean;
  iconSize?: number;
  loading?: boolean;
  backgroundColor?: string;
  borderRadius?: number;
  iconColor?: string;
}

export default function IconButton({
  icon,
  outline = false,
  loading,
  iconSize = 15,
  backgroundColor,
  iconColor,
  borderRadius = SIZES.radius_sm,
  ...props
}: IconButtonProps) {
  const colors = useThemeColors();
  var lockPressed = false;
  return (
    <CustomIconButton
      hitSlop={15}
      onPress={event => {
        if (loading) {
          return true;
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
        borderRadius: borderRadius,
        borderColor: loading ? '#ddd' : backgroundColor || colors.primary,
        backgroundColor: outline
          ? 'transparent'
          : loading
            ? '#ddd'
            : backgroundColor || colors.primary,
      }}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        icon && <Icon size={iconSize} icon={icon} color={iconColor ? iconColor : colors.text} />
      )}
    </CustomIconButton>
  );
}
const Icon = styled(FontAwesomeIcon)``;
const CustomIconButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.backgroundColor};
  padding: 10px;
  border-radius: ${props => props.theme.borderRadius}px;
  border-width: 1px;
  height: 35px;
  width: 35px;
  border-color: ${props => props.theme.borderColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
