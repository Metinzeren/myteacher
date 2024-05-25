import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import styled from 'styled-components';
import {useSharedValue} from 'react-native-reanimated';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faUser} from '@fortawesome/free-regular-svg-icons';
import useThemeColors from '../../constant/useColor';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {useState} from 'react';
import CustomText from '../Text/Text';

interface InputProps extends TextInputProps {
  iconPosition?: 'left' | 'right';
  icon?: IconProp;
  loading?: boolean;
  inputSize?: 'sm' | 'md';
  enableFocusBorder?: boolean;
  errorMessage?: string;
  required?: boolean;
  type?: 'checkbox' | 'radio' | 'text' | 'password' | 'email' | 'number';
}
export default function Input({
  iconPosition = 'left',
  icon = undefined,
  loading = false,
  inputSize = 'md',
  enableFocusBorder = true,
  errorMessage,
  type = 'text',
  required = false,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const [passwordShow, setPasswordShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    if (enableFocusBorder) {
      setIsFocused(true);
    }
  };
  const handleBlur = () => {
    if (enableFocusBorder) {
      setIsFocused(false);
    }
  };
  let size = inputSize === 'sm' ? '10px' : '15px';
  let iconSize = inputSize === 'sm' ? 17 : 20;

  let iconSmTop =
    inputSize === 'sm' ? (Platform.OS === 'ios' ? '10px' : '15px') : '20px';
  let iconMdTop = inputSize === 'md' ? '15px' : '20px';
  let iconTop = inputSize === 'sm' ? iconSmTop : iconMdTop;

  let inputPaddingHorizontal = inputSize === 'sm' ? '33px' : '40px';
  return (
    <View>
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
      <CustomInput
        autoFocus={false}
        placeholderTextColor={colors.primary}
        {...props}
        secureTextEntry={props.secureTextEntry && !passwordShow}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={
          required ? `${props.placeholder} *` : `${props.placeholder}`
        }
        theme={{
          size:
            inputSize === 'sm'
              ? '10px'
              : Platform.OS === 'android'
              ? '10px'
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
        }}
      />
      {props.secureTextEntry && (
        <PasswordIconButton
          theme={{
            iconTop: iconTop,
          }}
          onPress={() => setPasswordShow(!passwordShow)}>
          <FontAwesomeIcon
            icon={passwordShow ? faEye : faEyeSlash}
            size={iconSize}
            color={colors.iconColor}
          />
        </PasswordIconButton>
      )}
      {loading && (
        <ActivityIndicator
          style={{position: 'absolute', right: 10, top: 15}}
          color={colors.primary}
        />
      )}
      {iconPosition === 'right' && icon !== undefined && (
        <IconRight
          theme={{
            iconTop: iconTop,
          }}
          icon={icon}
          size={iconSize}
          color={colors.iconColor}
        />
      )}
      {errorMessage && (
        <View style={{marginTop: 7}}>
          <CustomText color="error">{errorMessage}</CustomText>
        </View>
      )}
    </View>
  );
}
const CustomInput = styled(TextInput)`
  padding: ${props => props.theme.size} ${props => props.theme.right}
    ${props => props.theme.size} ${props => props.theme.left};
  width: 100%;
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
const PasswordIconButton = styled(TouchableOpacity)`
  position: absolute;
  top: ${props => props.theme.iconTop};
  right: 10px;
  z-index: 1;
`;
