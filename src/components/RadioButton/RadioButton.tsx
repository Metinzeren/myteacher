import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import styled from 'styled-components';
import useThemeColors from '../../constant/useColor';
import CustomText from '../Text/Text';

interface RadioButtonProps extends TouchableOpacityProps {
  checked?: boolean;
  label?: string;
}
export default function RadioButton({
  checked = false,
  label,
  ...res
}: RadioButtonProps) {
  const color = useThemeColors();
  return (
    <CircleContainer activeOpacity={res.activeOpacity || 0.7} {...res}>
      <Circle theme={{borderColor: color.primary}}>
        {checked && <FilledCircle style={{backgroundColor: color.primary}} />}
      </Circle>
      {label && <CustomText style={{marginLeft: 10}}>{label}</CustomText>}
    </CircleContainer>
  );
}
const CircleContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;
const Circle = styled(View)`
  height: 25px;
  width: 25px;
  border-radius: 100px;
  border: 2.5px solid ${props => props.theme.borderColor};
  justify-content: center;
  align-items: center;
  padding: 5px;
`;
const FilledCircle = styled(View)`
  height: 13px;
  width: 12px;
  border-radius: 100px;
  background-color: ${props => props.theme.bgColor};
`;
