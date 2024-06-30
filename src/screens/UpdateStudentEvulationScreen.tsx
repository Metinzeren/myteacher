import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Container from '../components/Container/Container'
import Loading from '../components/Loading/Loading'
import FormKeyboardView from '../components/FormKeyboardView/FormKeyboardView'
import FormContainer, { FormContainerRef } from '../components/FormContainer'
import Input from '../components/Input/Input'
import { faQuestion, faReply, faTrash } from '@fortawesome/free-solid-svg-icons'
import Button from '../components/Button/Button'
import Questions from '../models/Questions'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import QuestionRepository from '../repositories/QuestionRepository'
import { Dropdown } from 'react-native-element-dropdown';
import useThemeColors from '../constant/useColor'
import { getResourceByKey } from '../lang/i18n'
import AlertDialog from '../components/AlertDialog/AlertDialog'
import { useQuestions } from '../context/StudentEvulationContext'
export default function UpdateStudentEvulationScreen(
    props: NativeStackScreenProps<RootStackParamList, 'UpdateStudentEvulationScreen'>
) {

    const [loading, setLoading] = useState(false);
    const questionRepo = QuestionRepository.getInstance();
    const { updateQuestion } = useQuestions()
    const questionId = props.route.params.questionId;
    const formRef = useRef<FormContainerRef>(null);
    const colors = useThemeColors()
    const [updateDto, setUpdateDto] = useState<Questions>({
        id: "",
        name: "",
        questionType: undefined,
        answer: [],
        answerType: undefined,
        teacherId: ""
    });

    useEffect(() => {
        loadQuestion();
    }, []);

    const loadQuestion = async () => {
        const questionInfo = await questionRepo.getQuestion(questionId);
        setUpdateDto({
            id: questionInfo.id,
            name: questionInfo.name,
            questionType: questionInfo.questionType,
            answer: questionInfo.answer,
            answerType: questionInfo.answerType,
            teacherId: questionInfo.teacherId
        });
    };
    const handleChange = (key: keyof Questions, value: string, answerIndex?: number) => {
        if (key === 'answer' && answerIndex !== undefined) {
            const updatedAnswers = [...updateDto.answer];
            updatedAnswers[answerIndex] = value;
            setUpdateDto(prevState => ({
                ...prevState,
                answer: updatedAnswers,
            }));
        } else {
            setUpdateDto(prevState => ({
                ...prevState,
                [key]: value,
            }));
        }
    };
    const [questionTypes, setQuestionTypes] = useState([
        { label: 'Puanlama', value: 'rating' },
        { label: 'Seçenekli', value: 'option' },
        { label: 'Yazı', value: 'text' },
    ]);

    const [answerTypes, setAnswerTypes] = useState([
        { label: 'Tekil', value: 'single' },
        { label: 'Çoğul', value: 'multiple' },
    ]);


    const handleUpdateQuestion = async () => {
        const isEmpty = formRef.current?.validate(
            getResourceByKey('addStudentForm'),
        );

        if (isEmpty) {
            setLoading(true);
            AlertDialog.showModal({
                title: 'Uyarı',
                message: 'Soru bilgileri düzenleme',
                onConfirm() {
                    questionRepo.updateQuestion(updateDto);
                    setLoading(false);
                    updateQuestion(updateDto);
                    AlertDialog.dismiss();
                    props.navigation.goBack();
                },
                onCancel() {
                    setLoading(false);
                },
            });
        }
    };
    return (
        <Container
            p={10}
            goBackShow
            header
            title="Soru Bilgisi"
            extraIcon={faTrash}
        >
            <Loading>
                <FormKeyboardView>
                    <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
                        <Input
                            required
                            id="name"
                            errorMessage=""
                            placeholder="Soru"
                            icon={faQuestion}
                            value={updateDto.name}
                            onChangeText={e => handleChange('name', e)}
                        />
                        {updateDto.answer?.map((answer, index) => (
                            <Input
                                key={index}
                                required
                                id={`answer_${index}`}
                                errorMessage=""
                                placeholder="Cevap"
                                icon={faReply}
                                value={answer}
                                onChangeText={e => handleChange('answer', e, index)}
                            />
                        ))}
                        <Dropdown
                            style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}
                            data={questionTypes}
                            labelField="label"
                            valueField="value"
                            placeholder="Soru Türü Seçin"
                            value={updateDto.questionType}
                            onChange={item => handleChange('questionType', item.value)}
                        />
                        {updateDto.questionType === "option" && (
                            <>
                                <Dropdown
                                    style={{ backgroundColor: "white", padding: 12, borderRadius: 10, borderColor: "red" }}
                                    data={answerTypes}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Cevap Türü Seçin"
                                    value={updateDto.answerType}
                                    onChange={item => handleChange('answerType', item.value)}
                                />
                            </>
                        )}

                    </FormContainer>

                </FormKeyboardView>
            </Loading>
            <Button
                loading={loading}
                borderRadius={10}
                onPress={handleUpdateQuestion}
                text="Kaydet"
            />
        </Container>
    )
}