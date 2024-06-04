import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {View} from 'react-native';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

export interface FormContainerProps {
  children: ReactNode;
}


export default function FormKeyboardView(props: FormContainerProps) {
  return (
    <KeyboardAwareScrollView
      extraHeight={100}
      enableOnAndroid={true}
      contentContainerStyle={{flexGrow: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
     {props.children}
    </KeyboardAwareScrollView>
  );
}

const FormContent = styled(View)`
  margin: 20px;
  gap: ${props => props.theme.gap}px;
`;
