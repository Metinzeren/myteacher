import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';
import Container from '../components/Container/Container';
import FormContainer, {FormContainerRef} from '../components/FormContainer';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import {t} from 'i18next';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import Questions from '../models/Questions';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import QuestionRepository from '../repositories/QuestionRepository';
import AlertDialog from '../components/AlertDialog/AlertDialog';

export default function AddStudentEvulationScreen(
  props: NativeStackScreenProps<
    RootStackParamList,
    'AddStudentEvulationScreen'
  >,
) {
  const formRef = useRef<FormContainerRef>(null);
  const [loading, setLoading] = useState(false);
  const [registerDto, setRegisterDto] = useState<Questions>({
    id: '',
    name: '',
    answer: [],
    questionType: undefined,
    teacherId: '',
  });
  const questionRepo = QuestionRepository.getInstance();
  const handleChange = (key: keyof typeof registerDto, value: any) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const handleAddQuestion = () => {
    let isEmpty = formRef.current?.validate();
    if (isEmpty) {
      setLoading(true);
      questionRepo.addQuestion(registerDto);
      setLoading(false);
      AlertDialog.showModal({
        title: 'Başarılı',
        message: 'Soru başarıyla eklendi',
        onConfirm() {
          props.navigation.goBack();
        },
      });
    }
  };

  return (
    <Container p={10} goBackShow header title="Soru Ekle">
      <EvulationContainer>
        <FormContainer style={{gap: 20}} formContainerRef={formRef}>
          <CustomText color="primaryText" fontSizes="body4">
            Soru Yazınız
          </CustomText>
          <Input
            required
            id="name"
            placeholder="Soru ekle"
            icon={faUser}
            value={registerDto?.name}
            onChangeText={e => handleChange('name', e)}
          />
          <CustomText color="primaryText" fontSizes="body4">
            Soru Tipini Seçiniz
          </CustomText>
          <ButtonGroup>
            <Button
              style={{flex: 1}}
              outline={registerDto.questionType === 'rating' ? false : true}
              text="Rating"
              onPress={() => handleChange('questionType', 'rating')}
            />
            <Button
              outline={registerDto.questionType === 'option' ? false : true}
              text="Option"
              style={{flex: 1}}
              onPress={() => handleChange('questionType', 'option')}
            />
            <Button
              style={{flex: 1}}
              outline={registerDto.questionType === 'text' ? false : true}
              text="Text"
              onPress={() => handleChange('questionType', 'text')}
            />
          </ButtonGroup>
        </FormContainer>
        <Button
          loading={loading}
          borderRadius={10}
          onPress={() => {
            handleAddQuestion();
          }}
          text={t('KAYDET')}
        />
      </EvulationContainer>
    </Container>
  );
}

const EvulationContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ButtonGroup = styled(View)`
  flex: 1;
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
`;
