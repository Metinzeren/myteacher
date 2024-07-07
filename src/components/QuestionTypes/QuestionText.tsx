import {View} from 'react-native';
import React from 'react';
import Input from '../Input/Input';

export default function QuestionText({
  value,
  setValue,
}: {
  value?: string;
  setValue: (value: string) => void;
}) {
  return (
    <View>
      <Input
        value={value}
        onChangeText={value => {
          setValue(value);
        }}
        required
        id="questionText"
        placeholder="Soru Cevabı"
        multiline
      />
    </View>
  );
}
