import {View, Text} from 'react-native';
import React from 'react';
import styled from 'styled-components';

import useThemeColors from '../constant/useColor';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMugSaucer} from '@fortawesome/free-solid-svg-icons/faMugSaucer';
export default function LoginScreen() {
  const colors = useThemeColors();
  return (
    <Container>
      <FontAwesomeIcon icon={faMugSaucer} />
      <Label
        theme={{
          color: 'red',
        }}>
        LoginScreen
      </Label>
    </Container>
  );
}
const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Label = styled(Text)`
  font-size: 24px;
  color: ${props => props.theme.color};
`;
