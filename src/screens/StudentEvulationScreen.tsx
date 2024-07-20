import React, { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Container from '../components/Container/Container';
import Loading from '../components/Loading/Loading';
import styled from 'styled-components';
import { TouchableOpacity, View } from 'react-native';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import CustomText from '../components/Text/Text';
import IconButton from '../components/IconButton/IconButton';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import Questions from '../models/Questions';
import QuestionRepository from '../repositories/QuestionRepository';
import { useQuestions } from '../context/StudentEvulationContext';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { useTranslation } from 'react-i18next';

export default function StudentEvulationScreen(
  props: NativeStackScreenProps<RootStackParamList, 'StudentEvulationScreen'>,
) {
  const questionRepo = QuestionRepository.getInstance();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      loadQuestions();
    });
  }, []);
  const { questions, setQuestions, deleteQuestion } = useQuestions()
  const loadQuestions = async () => {
    setLoading(true);
    await questionRepo.getQuestions()
      .then(res => {
        setQuestions(res);
      })
      .finally(() => {
        setLoading(false)
      })
    setLoading(false);
  };

  const handleDeleteQuestion = (id: string) => {
    AlertDialog.showModal({
      title: t('WARNING'),
      message: t('CLASS_DELETE_CHECK'),
      onConfirm() {
        questionRepo.deleteQuestion(id as string);
        deleteQuestion(id as string);
        AlertDialog.dismiss();
      },
      onCancel() { },
    });
  }

  const RenderItem = ({ item, index }: { item: Questions; index: number }) => {
    return (
      <ListItem
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 1.24,
          elevation: 3,
        }}
        onPress={() => { }}
        key={index}>
        <ListItemContainer>
          <CustomText fontWeight="bold" color="grey">
            {t("QUESTION")}:
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText fontSizes="caption" color="grey">
            {item.name}
          </CustomText>
        </ListItemContainer>
        <ListItemButtonContainer>
          <LeftSide>
            <CustomText color='textLink'>
              {item.questionType === "option" ? "Seçenekli" : item.questionType === "rating" ? "Puanlama" : "Yazı"}
            </CustomText>
          </LeftSide>
          <RightSide>
            <IconButton icon={faTrash} onPress={() => handleDeleteQuestion(item.id as string)}></IconButton>
            <IconButton icon={faPen} onPress={() => props.navigation.navigate('UpdateStudentEvulationScreen', { questionId: item.id as string })}></IconButton>
          </RightSide>

        </ListItemButtonContainer>
      </ListItem>
    );
  };
  return (
    <Container p={10} goBackShow header title={t("QUESTION")}>
      <Loading loading={loading}>
        <ListContainer>
          <CustomFlatList
            notFoundText={t("QUESTION_NOT_FOUND")}
            filter={(entity, value, index) => {
              return entity.name.toLowerCase().includes(value.toLowerCase());
            }}
            isSearchable
            data={questions}
            renderItem={RenderItem}
          />
        </ListContainer>
        <ButtonContainer>
          <Button
            borderRadius={10}
            text={t('QUESTION_ADD')}
            onPress={() => {
              props.navigation.navigate('AddStudentEvulationScreen');
            }}></Button>
        </ButtonContainer>
      </Loading>
    </Container>
  );
}

const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
`;
const ButtonContainer = styled(View)`
  flex: 0.2;
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
  padding-horizontal: 10px;
`;
const ListItem = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ListItemButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
  gap: 10px;
`;


const LeftSide = styled(View)`

`

const RightSide = styled(View)`
  flex-direction:row;
  gap:5px;
`