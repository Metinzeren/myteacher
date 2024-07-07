import {View, Text} from 'react-native';
import React from 'react';
import RadioButton from '../RadioButton/RadioButton';

export default function QuestionRating({
  ratingCount = 5,
  checked,
  setChecked,
}: {
  ratingCount?: number;
  checked: (value: string) => boolean;
  setChecked: (value: string) => void;
}) {
  return (
    <View style={{gap: 10}}>
      {Array.from({length: ratingCount}, (_, i) => (
        <RadioButton
          checked={checked((i + 1).toString())}
          onPress={() => {
            setChecked((i + 1).toString());
          }}
          label={(i + 1).toString()}
          key={i}
        />
      ))}
    </View>
  );
}
