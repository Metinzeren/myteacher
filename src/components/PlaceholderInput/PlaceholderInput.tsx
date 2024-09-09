import React, {useState} from 'react';
import {
  View,
  Platform,
  TouchableOpacityProps,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleRight, faCalendar} from '@fortawesome/free-solid-svg-icons';
import useThemeColors from '../../constant/useColor';
import CustomText from '../Text/Text';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

interface PlaceholderInputProps extends TouchableOpacityProps {
  placeholder?: string;
  iconPosition?: 'left' | 'right';
  icon?: IconProp;
  inputSize?: 'sm' | 'md';
  required?: boolean;
  value?: string;
  errorMessage?: string;
  rightIcon?: IconProp;
  rightIconShow?: boolean;
  rightIconColor?: string;
}

const PlaceholderInput = ({
  placeholder,
  iconPosition = 'left',
  icon,
  inputSize = 'md',
  required,
  errorMessage,
  value,
  rightIconShow = true,
  ...props
}: PlaceholderInputProps) => {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  let size = inputSize === 'sm' ? '10px' : '55px';
  let iconSize = inputSize === 'sm' ? 17 : 20;
  let iconSmTop =
    inputSize === 'sm' ? (Platform.OS === 'ios' ? '10px' : '15px') : '20px';
  let iconMdTop = inputSize === 'md' ? '15px' : '20px';
  let iconTop = inputSize === 'sm' ? iconSmTop : iconMdTop;
  let inputPaddingHorizontal = inputSize === 'sm' ? '33px' : '40px';

  return (
    <TouchableContainer>
      {iconPosition === 'left' && icon && (
        <IconLeft
          theme={{
            iconTop: iconTop,
          }}
          icon={icon}
          size={iconSize}
          color={colors.iconColor}
        />
      )}

      <StyledTouchable
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        theme={{
          size:
            inputSize === 'sm'
              ? '10px'
              : Platform.OS === 'android'
              ? '15px'
              : '15px',
          left:
            iconPosition === 'left' && icon !== undefined
              ? inputPaddingHorizontal
              : size,
          right:
            iconPosition === 'right' && icon !== undefined
              ? inputPaddingHorizontal
              : size,
          borderColor: isFocused ? colors.activeBorder : colors.inputBorder,
        }}>
        <CustomText numberOfLines={1} color="descriptionColor">
          {value || (required ? `${placeholder} *` : placeholder)}
        </CustomText>
      </StyledTouchable>

      {rightIconShow && (
        <IconRight
          theme={{
            iconTop: iconTop,
          }}
          icon={props.rightIcon || faAngleRight}
          size={iconSize}
          color={props.rightIconColor || colors.iconColor}
        />
      )}
      {errorMessage && (
        <CustomText color="error" fontSizes="body4">
          {errorMessage}
        </CustomText>
      )}
    </TouchableContainer>
  );
};

const TouchableContainer = styled(View)`
  position: relative;
`;

const StyledTouchable = styled(TouchableOpacity)`
  padding: ${props => props.theme.size} ${props => props.theme.right}
    ${props => props.theme.size} ${props => props.theme.left};
  border-radius: 10px;
  background-color: #fff;
  color: #143722;
  border: 1px solid ${props => props.theme.borderColor};
`;

const IconLeft = styled(FontAwesomeIcon)`
  position: absolute;
  top: ${props => props.theme.iconTop};
  left: 10px;
  z-index: 1;
`;

const IconRight = styled(FontAwesomeIcon)`
  position: absolute;
  top: ${props => props.theme.iconTop};
  right: 10px;
  z-index: 1;
`;

export default PlaceholderInput;
