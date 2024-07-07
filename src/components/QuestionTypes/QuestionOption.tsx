import {View, Text} from 'react-native';
import React from 'react';
import AnswerType from '../../models/AnswerType';
import CheckboxButton from '../CheckboxButton/CheckboxButton';
import RadioButton from '../RadioButton/RadioButton';

export default function QuestionOption({
  answers,
  answerType,
  checked,
  setChecked,
}: {
  answers: string[];
  answerType?: AnswerType;
  checked: (value: string[]) => boolean;
  setChecked: (value: string[]) => void;
}) {
  return (
    <View style={{gap: 10}}>
      {answerType === 'multiple'
        ? answers.map((answer, index) => (
            <CheckboxButton
              checked={checked([answer])}
              onPress={() => {
                setChecked([answer]);
              }}
              key={index}
              label={answer}
            />
          ))
        : null}
      {answerType === 'single'
        ? answers.map((answer, index) => (
            <RadioButton
              checked={checked([answer])}
              onPress={() => {
                setChecked([answer]);
              }}
              key={index}
              label={answer}
            />
          ))
        : null}
    </View>
  );
}
