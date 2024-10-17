import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import QuestionRepository from '../../repositories/QuestionRepository';
import Questions from '../../models/Questions';
import Container from '../Container/Container';
import Loading from '../Loading/Loading';
import QuestionOption from '../QuestionTypes/QuestionOption';
import QuestionText from '../QuestionTypes/QuestionText';
import QuestionRating from '../QuestionTypes/QuestionRating';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import CustomFlatList from '../Flatlist/CustomFlatList';
import Evulation from '../../models/Evulation';
import Student from '../../models/Student';
import EvulationQuestions from '../../models/EvulationQuestions';
import Button from '../Button/Button';
import AlertDialog from '../AlertDialog/AlertDialog';
import EvulationRepository from '../../repositories/EvulationRepository';
import EvulationResponse from '../../models/EvulationResponse';
import { useTranslation } from 'react-i18next';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';

export default function QuestionsList({
  student,
  answers,

}: {
  student: Student;
  answers?: EvulationResponse[];
}) {
  const questionRepo = QuestionRepository.getInstance();
  const evulationRepo = EvulationRepository.getInstance();
  const { t } = useTranslation()
  const [questions, setQuestions] = useState<Array<Questions>>([]);
  const [loading, setLoading] = useState(true);
  const [evulation, setEvulation] = useState<Evulation>({
    studentId: student.id as string,
    date: '2021-08-01',
    evulationQuestions: [],
  });
  useEffect(() => {
    loadQuestions();
    return () => {
      setQuestions([]);
      setLoading(false);
    };
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const questions = await questionRepo.getQuestions();
    setQuestions(questions);
    if (answers) {

    } else {
      let questionsArray = questions.map(question => {
        return {
          questionId: question.id as string,
          answer: [],
        } as any;
      }) as EvulationQuestions[];
      setEvulation({
        ...evulation,
        evulationQuestions: questionsArray,
      });
    }

    setLoading(false);
  };
  const renderQuestion = (question: Questions) => {
    let answer = evulation.evulationQuestions.find(
      evulationQuestion =>
        evulationQuestion?.questionId === (question?.id as string),
    );
    switch (question.questionType) {
      case 'option':
        return (
          <QuestionOption
            checked={(value: string[]) => {
              if (question.answerType === 'single') {
                return answer?.answer[0] === value[0];
              }
              return answer?.answer.some(item =>
                value.includes(item),
              ) as boolean;
            }}
            setChecked={(value: string[]) => {
              if (question.answerType === 'single') {
                handleAnswer(question.id as string, value);
              } else {
                let tempAnswer = answer?.answer as string[];
                if (tempAnswer.includes(value[0])) {
                  tempAnswer = tempAnswer.filter(item => item !== value[0]);
                } else {
                  tempAnswer.push(value[0]);
                }
                handleAnswer(question.id as string, tempAnswer);
              }
            }}
            answerType={question.answerType}
            answers={question.answer}
          />
        );
      case 'text':
        return (
          <QuestionText
            value={answer?.answer[0]}
            setValue={(value: string) =>
              handleAnswer(question.id as string, [value])
            }
          />
        );
      case 'rating':
        return (
          <QuestionRating
            checked={(value: string) => answer?.answer[0] === value}
            setChecked={(value: string) =>
              handleAnswer(question.id as string, [value])
            }
          />
        );
      default:
        return <Text>Question Type Not Found</Text>;
    }
  };
  const handleAnswer = (questionId: string, answer: string[]) => {
    let evulationQuestions = evulation.evulationQuestions.map(question => {
      if (question.questionId === questionId) {
        return {
          ...question,
          answer: answer,
        };
      }
      return question;
    });
    setEvulation({
      ...evulation,
      evulationQuestions: evulationQuestions,
    });
  };
  const RenderItem = ({ item, index }: { item: Questions; index: number }) => {
    const question = item;
    return (
      <QuestionCard
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.22,
          shadowRadius: 3.2,
          elevation: 5,
        }}
        key={index}>
        <CustomText color="textLink">{`${index + 1}. Soru`}</CustomText>
        <View style={{ marginBottom: 10 }}>
          <CustomText fontSizes="body4" color="primaryText">
            {question.name}
          </CustomText>
        </View>
        {renderQuestion(question)}
      </QuestionCard>
    );
  };

  const handleSave = async () => {
    let evulationQuestions = evulation.evulationQuestions.filter(
      question => question.answer.length > 0,
    );

    if (evulationQuestions.length === 0) {
      AlertDialog.showModal({
        title: t('ERROR'),
        message: 'Lütfen önce soru ekleyiniz',
      });
      return;
    }

    try {
      const entity = await evulationRepo.addEvulation(evulation);
      if (entity) {
        AlertDialog.showModal({
          title: t('SUCCESS'),
          message: 'Değerlendirme başarılı bir şekilde kaydedildi.',
          type: 'success',
        });
      } else {
        AlertDialog.showModal({
          title: t('ERROR'),
          message: 'Değerlendirme kaydedilirken bir hata oluştu.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error("Error during evaluation save:", error);
      AlertDialog.showModal({
        title: t('ERROR'),
        message: 'Değerlendirme kaydedilirken bir hata oluştu.',
        type: 'error',
      });
    }
  };


  return (


    <Loading loading={loading}>

      <Container>
        <CustomFlatList isBottomSheet data={questions} renderItem={RenderItem} />
      </Container>
      <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
        <Button text={t("SAVE")} onPress={() => handleSave()} />
      </View>


    </Loading>


  );
}
const QuestionCard = styled(View)`
  padding: 10px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
`;
