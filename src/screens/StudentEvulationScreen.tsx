import { View, Text } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Container from '../components/Container/Container';
export default function StudentEvulationScreen(
    props: NativeStackScreenProps<RootStackParamList, "StudentEvulationScreen">,

) {
  return (
    <Container goBackShow header title='Değerlendirme Soruları'>
      <Text>StudentEvulationScreen</Text>
    </Container>
  )
}