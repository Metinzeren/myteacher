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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

interface CheckboxButtonProps extends TouchableOpacityProps {
  checked?: boolean;
  label?: string;
}
export default function CheckboxButton({
  checked = false,
  label,
  ...res
}: CheckboxButtonProps) {
  const color = useThemeColors();
  return (
    <BoxContainer activeOpacity={res.activeOpacity || 0.7} {...res}>
      <Box theme={{borderColor: color.primary}}>
        {checked && <FontAwesomeIcon icon={faCheck} color={color.primary} />}
      </Box>
      {label && (
        <CustomText style={{marginLeft: 10, fontWeight: 'bold'}}>
          {label}
        </CustomText>
      )}
    </BoxContainer>
  );
}
const BoxContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;
const Box = styled(View)`
  height: 25px;
  width: 25px;
  border-radius: 5px;
  border: 2.5px solid ${props => props.theme.borderColor};
  justify-content: center;
  align-items: center;
  padding: 5px;
`;
