import {View, Text} from 'react-native';
import React from 'react';
import styled from 'styled-components';

export default function Divider({
  color,
  marginTop,
  marginBottom,
}: {
  color?: string;
  marginTop?: string;
  marginBottom?: string;
}) {
  return (
    <Div
      theme={{
        colors: color || '#D2DDEB',
        marginTop: marginTop || '0',
        marginBottom: marginBottom || '0',
      }}
    />
  );
}
const Div = styled(View)`
  height: 1px;
  margin-top: ${props => props.theme.marginTop}px;
  margin-bottom: ${props => props.theme.marginBottom}px;
  background-color: ${props => props.theme.colors};
`;
