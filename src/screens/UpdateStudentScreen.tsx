import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Loading from '../components/Loading/Loading';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input/Input';
import {
  faAngleRight,
  faDeleteLeft,
  faEnvelope,
  faPhone,
  faSortNumericDesc,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FormContainerRef } from '../components/FormContainer';
import Student from '../models/Student';

import Button from '../components/Button/Button';
import { t } from 'i18next';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import FormKeyboardView from '../components/FormKeyboardView/FormKeyboardView';
import styled from 'styled-components';
import Accordion from '../components/Accordion/Accordion';
import { getResourceByKey } from '../lang/i18n';
import EvulationRepository from '../repositories/EvulationRepository';
import EvulationQuestionResponse from '../models/EvulationQuestionResponse';
import EvulationResponse from '../models/EvulationResponse';
import CustomText from '../components/Text/Text';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useThemeColors from '../constant/useColor';

export default function UpdateStudentScreen(
  props: NativeStackScreenProps<RootStackParamList, 'UpdateStudentScreen'>,
) {
  const { classRooms } = useClassRooms();
  const studentFromParam = props.route.params.student;
  const studentId = props.route.params.studentId;

  const [loading, setLoading] = useState(false);
  const classRoomId = props.route.params.classRoomId;

  const student =
    studentFromParam ??
    (classRooms
      ?.find?.(c => c.id == classRoomId)
      ?.students.find(d => d.newStudentId === studentId) as Student);

  const [updateDto, setUpdateDto] = useState<Student>({
    id: student?.id,
    firstName: student?.firstName,
    lastName: student?.lastName,
    studentNo: student?.studentNo,
    parentEmail: student?.parentEmail,
    parentFirstName: student?.parentFirstName,
    parentLastName: student?.parentLastName,
    parentPhone: student?.parentPhone,
    absenteeism: student?.absenteeism,
  });
  const [evulation, setEvulation] = useState<Array<EvulationResponse>>([]);
  const colors = useThemeColors();
  const classRoomRepo = ClassRoomRepository.getInstance();
  const evulationRepo = EvulationRepository.getInstance();
  const { updateStudentInClassRoom, deleteStudentFromClassRoom } =
    useClassRooms();
  const formRef = useRef<FormContainerRef>(null);

  useEffect(() => {
    getEvulation();
  }, []);

  const getEvulation = async () => {
    const evulation = await evulationRepo.getEvulationWithQuestions(
      student.newStudentId as string,
    );
    setEvulation(evulation);
  };
  const handleChange = (key: keyof Student, value: string) => {
    setUpdateDto(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateStudent = async () => {
    const isEmpty = formRef.current?.validate(
      getResourceByKey('addStudentForm'),
    );

    if (isEmpty) {
      setLoading(true);
      AlertDialog.showModal({
        title: 'Uyarı',
        message: 'Öğrencinin bilgileri düzenleme',
        onConfirm() {
          classRoomRepo.updateStudentInClassRoom(classRoomId, updateDto);
          setLoading(false);
          updateStudentInClassRoom(classRoomId, updateDto);
          AlertDialog.dismiss();
          props.navigation.goBack();
        },
        onCancel() {
          setLoading(false);
        },
      });
    }
  };

  const pressToDelete = () => {

    AlertDialog.showModal({
      title: 'Uyarı',
      message: `${student.firstName} ${student.lastName} öğrenciyi silmeye emin misiniz?`,
      onConfirm() {
        classRoomRepo.removeStudentFromClassRoom(
          classRoomId,
          student.newStudentId as string,
        );
        deleteStudentFromClassRoom(classRoomId, student.newStudentId as string);
        AlertDialog.dismiss();
        props.navigation.goBack();
      },
      onCancel() { },
    });
  };

  return (
    <Container
      p={10}
      goBackShow
      header
      title="Öğrenci Bilgisi"
      extraIcon={faTrash}
      extraIconPress={() => pressToDelete()}>
      <Loading>
        <FormKeyboardView>
          <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
            <Input
              required
              id="firstName"
              errorMessage=""
              placeholder="Ad"
              icon={faUser}
              value={updateDto.firstName}
              onChangeText={e => handleChange('firstName', e)}
            />
            <Input
              required
              id="lastName"
              errorMessage=""
              placeholder="Soyad"
              icon={faUser}
              value={updateDto.lastName}
              onChangeText={e => handleChange('lastName', e)}
            />
            <Input
              required
              errorMessage=""
              id="studentNo"
              placeholder="Öğrenci okul numarası"
              icon={faSortNumericDesc}
              keyboardType="numeric"
              value={updateDto.studentNo?.toString()}
              onChangeText={e => handleChange('studentNo', e)}
            />
            <Input
              required
              errorMessage=""
              id="parentFirstName"
              placeholder="Veli adı"
              icon={faUser}
              value={updateDto.parentFirstName}
              onChangeText={e => handleChange('parentFirstName', e)}
            />
            <Input
              required
              errorMessage=""
              id="parentLastName"
              placeholder="Veli Soyadı"
              icon={faUser}
              value={updateDto.parentLastName}
              onChangeText={e => handleChange('parentLastName', e)}
            />
            <Input
              required
              id="parentPhone"
              placeholder="Veli telefon numarası"
              icon={faPhone}
              keyboardType="numeric"
              maxLength={11}
              value={updateDto.parentPhone}
              onChangeText={e => handleChange('parentPhone', e)}
            />
            <Input
              required
              id="parentEmail"
              errorMessage=""
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Veli e-mail"
              icon={faEnvelope}
              value={updateDto.parentEmail}
              onChangeText={e => handleChange('parentEmail', e)}
            />
          </FormContainer>
          <AccordionContainer>
            <Accordion title="Değerlendirmeler">
              {evulation.map((evulation, index) => (
                <EvulationCard
                  onPress={() => {
                    AlertDialog.showModal({
                      title: 'Değerlendirme',
                      onCancel() {

                      },
                      onCancelText: "Kapat",
                      content: evulation.evulationQuestions.map(
                        (question, index) => (
                          <CardContentContainer
                            key={index}>
                            <CustomText fontSizes='body4' color="textLink">{`${index + 1
                              }.`}</CustomText>
                            <CardContentRight>
                              <CustomText color='primaryText'>
                                {question.question.name}
                              </CustomText>
                              <CustomText color='textLink'>
                                {question.answer[0]}
                              </CustomText>
                            </CardContentRight>

                          </CardContentContainer>

                        ),
                      ),
                    });
                  }}
                  key={index}>
                  <CustomText color="primaryText">{evulation.date}</CustomText>
                  <FontAwesomeIcon
                    color={colors.iconColor}
                    icon={faAngleRight}
                  />
                </EvulationCard>
              ))}
            </Accordion>
          </AccordionContainer>
          <Button
            loading={loading}
            borderRadius={10}
            onPress={updateStudent}
            text={t('KAYDET')}
          />
        </FormKeyboardView>
      </Loading>
    </Container>
  );
}
const AccordionContainer = styled(View)``;
const EvulationCard = styled(TouchableOpacity)`
  padding: 10px;
  margin-vertical: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  flex-direction: row;
  justify-content: space-between;
`;

const CardContentContainer = styled(View)`
  background-color: #fff;
  padding: 15px;
  gap:5px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: row;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`

const CardContentRight = styled(View)`
  
`