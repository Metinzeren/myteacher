import { View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Container from '../components/Container/Container';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { t } from 'i18next';
import { faPlus, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import Questions from '../models/Questions';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import QuestionRepository from '../repositories/QuestionRepository';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import IconButton from '../components/IconButton/IconButton';
import RadioButton from '../components/RadioButton/RadioButton';
import useThemeColors from '../constant/useColor';
import AnswerForm from '../components/AnswerForm/AnswerForm';
import AnswerList from '../components/AnswerList/AnswerList';
import Loading from '../components/Loading/Loading';
import { getUserId } from '../utils/AsyncStorageUtils';

export default function AddStudentEvulationScreen(
  props: NativeStackScreenProps<
    RootStackParamList,
    'AddStudentEvulationScreen'
  >,
) {
  const colors = useThemeColors();
  const formRef = useRef<FormContainerRef>(null);
  const [loading, setLoading] = useState(false);
  const [registerDto, setRegisterDto] = useState<Questions>({
    id: '',
    name: '',
    answer: [],
    questionType: undefined,
    answerType: undefined,
    teacherId: '',
  });
  const questionRepo = QuestionRepository.getInstance();
  const handleChange = (key: keyof typeof registerDto, value: any) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };
  const handleAddQuestion = async () => {
    let isEmpty = formRef.current?.validate();
    let userId = await getUserId()
    let addedUserIdFromTeacher = { ...registerDto, teacherId: [userId] };

    if (isEmpty) {
      setLoading(true);
      questionRepo.addQuestion(addedUserIdFromTeacher as any);
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

  const [answers, setAnswers] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddAnswer = (newAnswer: string) => {
    setAnswers([...answers, newAnswer]);
    handleChange('answer', [...answers, newAnswer]);
  };

  const handleDeleteAnswer = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    handleChange('answer', newAnswers);
  };


  return (
    <Container p={10} goBackShow header title="Soru Ekle">
      <Loading loading={loading}>
        <EvulationContainer>
          <FormContainer style={{ gap: 20 }} formContainerRef={formRef}>
            <CustomText color="primaryText" fontSizes="body4">
              Soru yazınız
            </CustomText>
            <Input
              required
              id="name"
              placeholder="Soru ekle"
              icon={faQuestion}
              value={registerDto?.name}
              onChangeText={e => handleChange('name', e)}
            />
            <CustomText color="primaryText" fontSizes="body4">
              Soru tipini seçiniz
            </CustomText>
            <ButtonContainer>
              <Button
                style={{ flex: 1 }}
                outline={registerDto.questionType === 'rating' ? false : true}
                text="Rating"
                onPress={() => handleChange('questionType', 'rating')}
              />
              <Button
                outline={registerDto.questionType === 'option' ? false : true}
                text="Option"
                style={{ flex: 1 }}
                onPress={() => handleChange('questionType', 'option')}
              />
              <Button
                style={{ flex: 1 }}
                outline={registerDto.questionType === 'text' ? false : true}
                text="Text"
                onPress={() => handleChange('questionType', 'text')}
              />
            </ButtonContainer>

            {registerDto.questionType === 'option' && (
              <AnswerContainer>
                <CustomText fontSizes="body4" color="primaryText">
                  Soru tipini seçiniz
                </CustomText>
                <View
                  style={{
                    marginVertical: 10,
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    borderWidth: 1,
                    flexDirection: 'row',
                    padding: 10,
                    borderRadius: 10,
                    borderColor: colors.primary,
                  }}>
                  <RadioButton
                    checked={registerDto.answerType === 'single'}
                    label="Tekli Seçim"
                    onPress={() => {
                      handleChange('answerType', 'single');
                    }}
                  />
                  <RadioButton
                    checked={registerDto.answerType === 'multiple'}
                    label="Çoklu Seçim"
                    onPress={() => {
                      handleChange('answerType', 'multiple');
                    }}
                  />
                </View>
                <AnswerHeader>
                  <CustomText color="primaryText" fontSizes="body4">
                    Cevap ekleyin
                  </CustomText>
                  <IconButton icon={faPlus} onPress={() => setShowForm(true)} />
                </AnswerHeader>
                {showForm && (
                  <AnswerForm onAddAnswer={handleAddAnswer} onClose={() => setShowForm(false)} />
                )}
                <AnswerList answers={answers} onDeleteAnswer={handleDeleteAnswer} />
              </AnswerContainer>
            )}
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
      </Loading>
    </Container>
  );
}

const EvulationContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 10px;
`;
const AnswerContainer = styled(View)``;
const AnswerHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom:10px;
`;
