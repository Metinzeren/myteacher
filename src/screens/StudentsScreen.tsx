import {View, Text} from 'react-native';
import React from 'react';
import Container from '../components/Container/Container';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';

export default function StudentsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'StudentsScreen'>,
) {
  return <Container isGoBack header title="Öğrenciler"></Container>;
}
