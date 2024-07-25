import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import styled from 'styled-components';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Loading from '../components/Loading/Loading';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input/Input';
import {
  faAngleRight,
  faEnvelope,
  faPhone,
  faSortNumericDesc,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FormContainerRef } from '../components/FormContainer';
import Student from '../models/Student';
import ImageViewer from 'react-native-image-zoom-viewer';
import Button from '../components/Button/Button';
import { t } from 'i18next';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import FormKeyboardView from '../components/FormKeyboardView/FormKeyboardView';
import Accordion from '../components/Accordion/Accordion';
import { getResourceByKey } from '../lang/i18n';
import EvulationRepository from '../repositories/EvulationRepository';
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
  const classRoomId = props.route.params.classRoomId;
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors();
  const classRoomRepo = ClassRoomRepository.getInstance();
  const evulationRepo = EvulationRepository.getInstance();
  const formRef = useRef<FormContainerRef>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  const mockAbsence = [
    {
      date: '12.12.2021',
      url: 'https://picsum.photos/200/300',
      reason: 'Hastalık',
    },
    {
      date: '12.12.2024',
      url: 'https://picsum.photos/200/300',
      reason: 'Gezi',
    },
    {
      date: '12.12.2022',
      url: 'https://picsum.photos/200/300',
      reason: 'Cenaze',
    },
  ];

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
        title: t('WARNING'),
        message: t('STUDENT_EDIT'),
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
      title: t('WARNING'),
      message: `${student.firstName} ${student.lastName} ${t('STUDENT_DELETE_CHECK')}`,
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
      title={t('STUDENT_INFO')}
      extraIcon={faTrash}
      extraIconPress={() => pressToDelete()}
    >
      <Loading>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.background,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <FormKeyboardView>
            <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
              <Input
                required
                id="firstName"
                errorMessage=""
                placeholder={t('FIRST_NAME')}
                icon={faUser}
                value={updateDto.firstName}
                onChangeText={e => handleChange('firstName', e)}
              />
              <Input
                required
                id="lastName"
                errorMessage=""
                placeholder={t('LAST_NAME')}
                icon={faUser}
                value={updateDto.lastName}
                onChangeText={e => handleChange('lastName', e)}
              />
              <Input
                required
                errorMessage=""
                id="studentNo"
                placeholder={t('STUDENT_NO')}
                icon={faSortNumericDesc}
                keyboardType="numeric"
                value={updateDto.studentNo?.toString()}
                onChangeText={e => handleChange('studentNo', e)}
              />
              <Input
                required
                errorMessage=""
                id="parentFirstName"
                placeholder={t('PARENT_FIRST_NAME')}
                icon={faUser}
                value={updateDto.parentFirstName}
                onChangeText={e => handleChange('parentFirstName', e)}
              />
              <Input
                required
                errorMessage=""
                id="parentLastName"
                placeholder={t('PARENT_LAST_NAME')}
                icon={faUser}
                value={updateDto.parentLastName}
                onChangeText={e => handleChange('parentLastName', e)}
              />
              <Input
                required
                id="parentPhone"
                placeholder={t('PARENT_PHONE')}
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
                placeholder={t('PARENT_EMAIL')}
                icon={faEnvelope}
                value={updateDto.parentEmail}
                onChangeText={e => handleChange('parentEmail', e)}
              />
            </FormContainer>

            <AccordionContainer>
              <Accordion title={t('EVULATION')}>
                {evulation.map((evulation, index) => (
                  <EvulationCard
                    onPress={() => {
                      AlertDialog.showModal({
                        title: t('EVULATION'),
                        onCancel() { },
                        onCancelText: t('CANCEL'),
                        content: evulation.evulationQuestions.map(
                          (question, index) => (
                            <CardContentContainer key={index}>
                              <CustomText fontSizes="body4" color="textLink">{`${index + 1}.`}</CustomText>
                              <CardContentRight>
                                <CustomText color="primaryText">
                                  {question.question.name}
                                </CustomText>
                                <CustomText color="textLink">
                                  {question.answer[0]}
                                </CustomText>
                              </CardContentRight>
                            </CardContentContainer>
                          ),
                        ),
                      });
                    }}
                    key={index}
                  >
                    <CustomText color="primaryText">{evulation.date}</CustomText>
                    <FontAwesomeIcon
                      color={colors.iconColor}
                      icon={faAngleRight}
                    />
                  </EvulationCard>
                ))}
              </Accordion>
            </AccordionContainer>

            <AccordionContainer>
              <Accordion title={t('STUDENT_ABSENCE')}>
                {mockAbsence.map((absence, index) => (
                  <AbsenceCard
                    key={index}
                    onPress={() => {
                      AlertDialog.showModal({
                        title: t('STUDENT_ABSENCE'),
                        onCancel() { },
                        onCancelText: t('CANCEL'),
                        content: (
                          <ScrollView
                            style={{ maxHeight: '80%' }}
                          >
                            {mockAbsence.map((absence, index) => (
                              <CardContentContainer key={index} >
                                <CustomText fontSizes="body4" color="textLink">{`${index + 1}.`}</CustomText>
                                <CardContentRight>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setSelectedImage([{ url: absence.url }] as any);
                                      setModalVisible(true);
                                    }}
                                  >
                                    <Image
                                      source={{ uri: absence.url }}
                                      style={{ width: 150, height: 150, borderRadius: 8 }}
                                    />
                                  </TouchableOpacity>

                                  <CustomText color="primaryText">{absence.date}</CustomText>
                                  <CustomText color="textLink">{absence.reason}</CustomText>
                                </CardContentRight>
                              </CardContentContainer>
                            ))}
                          </ScrollView>
                        ),
                      });
                    }}
                  >
                    <CustomText color="primaryText">{absence.date}</CustomText>
                    <FontAwesomeIcon color={colors.iconColor} icon={faAngleRight} />
                  </AbsenceCard>

                ))}
              </Accordion>
            </AccordionContainer>

          </FormKeyboardView>
          <ButtonContainer>
            <Button
              loading={loading}
              borderRadius={10}
              onPress={updateStudent}
              text={t('KAYDET')}
            />
          </ButtonContainer>
        </ScrollView>
      </Loading>
      {modalVisible && (
        <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
          <ImageViewer imageUrls={selectedImage} />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', top: 40, right: 20 }}>
            <CustomText color="white">Close</CustomText>
          </TouchableOpacity>
        </Modal>
      )}
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

const AbsenceCard = styled(TouchableOpacity)`
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
  gap: 5px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: row;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ButtonContainer = styled(View)`
  flex: 0.2;
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
  padding-horizontal: 10px;
`;

const CardContentRight = styled(View)`
  flex-direction: column;
  gap: 5px;
  flex: 1;
  justify-content: center;
`;
