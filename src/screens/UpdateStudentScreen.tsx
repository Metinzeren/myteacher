import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
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
import axios from 'axios';
import { getLocalStorage } from '../utils/AsyncStorageUtils';
import CustomBottomSheet, {
  BottomSheetRef,
} from '../components/CustomBottomSheet/CustomBottomSheet';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import EvulationQuestionResponse from '../models/EvulationQuestionResponse';
import { deleteStudent } from '../firebase/FirebaseApi';
import AbsenteeismRepository from '../repositories/AbsenteeismRepository';
import Absenteeism from '../models/Absenteeism';
import dayjs from 'dayjs';

export default function UpdateStudentScreen(
  props: NativeStackScreenProps<RootStackParamList, 'UpdateStudentScreen'>,
) {
  const { classRooms, deleteStudentFromClassRoom, updateStudentInClassRoom } =
    useClassRooms();
  const studentFromParam = props.route.params.student;
  const studentId = props.route.params.studentId;
  let notificationLanguage = getResourceByKey('notifications');
  const classRoomId = props.route.params.classRoomId;
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors();
  const classRoomRepo = ClassRoomRepository.getInstance();
  const evulationRepo = EvulationRepository.getInstance();
  const AbsenteeismRepo = AbsenteeismRepository.getInstance();
  const formRef = useRef<FormContainerRef>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const absenceBottomSheetRef = useRef<BottomSheetRef>(null);
  const evulationBottomSheetRef = useRef<BottomSheetRef>(null);


  const student =
    studentFromParam ??
    (classRooms
      ?.find?.(c => c.id == classRoomId)
      ?.students.find(d => d.id === studentId) as Student);

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
    parentId: student?.parentId,
  });

  const [evulation, setEvulation] = useState<Array<EvulationResponse>>([]);
  const [selectedEvulation, setSelectedEvulation] = useState<EvulationResponse>(
    {} as EvulationResponse,
  );
  const [absenteeisms, setAbsenteeisms] = useState([]);
  const [selectedAbsence, setSelectedAbsence] = useState<Absenteeism>()
  useEffect(() => {
    getEvulation();
    getAbsenteeisms()
  }, []);

  const getEvulation = async () => {
    const evulation = await evulationRepo.getEvulationWithQuestions(
      student.id as string,
    );
    setEvulation(evulation);
  };

  const getAbsenteeisms = async () => {
    const absences = await AbsenteeismRepo.getAbsenteeismByStudentId(student.id as string);
    setAbsenteeisms(absences as any);

  }

  const handleChange = (key: keyof Student, value: string) => {
    setUpdateDto(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateStudent = () => {
    const isEmpty = formRef.current?.validate(
      getResourceByKey('addStudentForm'),
    );

    if (isEmpty) {
      setLoading(true);
      AlertDialog.showModal({
        title: t('WARNING'),
        message: t('STUDENT_EDIT'),
        onConfirm: async () => {
          try {
            const response = await classRoomRepo.updateStudentInClassRoom(classRoomId, updateDto);

            updateStudentInClassRoom(classRoomId, updateDto);
            AlertDialog.dismiss();
            props.navigation.goBack();
          } catch (error) {
            console.error(error);

          } finally {
            setLoading(false);
          }
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
      message: `${student.firstName} ${student.lastName} ${t(
        'STUDENT_DELETE_CHECK',
      )}`,
      onConfirm: async () => {
        setLoading(true);

        try {
          const user = await getLocalStorage("AUTH_USER");
          const accessToken = user?.stsTokenManager?.accessToken;
          let data = {
            classRoomId: classRoomId,
            studentId: student.id,
            parentId: student.parentId,
          };

          deleteStudent({
            accessToken,
            data,
          });

          deleteStudentFromClassRoom(
            classRoomId,
            student.id as string,
          );
          AlertDialog.dismiss();
          props.navigation.goBack();
        } catch (error) {
          console.error('Error deleting student:', error);
          AlertDialog.dismiss();
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        setLoading(false);
      },
    });
  };

  const AbsenceContent = () => {
    return (
      <CardContentContainer >
        <CardContentRight>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage([{ url: selectedAbsence?.photo }] as any);
              setModalVisible(true);
            }}>
            {selectedAbsence?.photo && <Image
              source={{ uri: selectedAbsence?.photo }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 8,
              }}
            />}
          </TouchableOpacity>
          <Fields>
            <CustomText color="darkCyan" fontSizes='body3'>{t("ABSENCE_DATE")}</CustomText>
            <CustomText color="dark">{dayjs(selectedAbsence?.startDate).format('DD.MM.YYYY')} - {dayjs(selectedAbsence?.endDate).format('DD.MM.YYYY')}</CustomText>
          </Fields>
          <Fields>
            <CustomText color="darkCyan" fontSizes='body3'>{t("DESCRIPTION")}</CustomText>
            <CustomText color="dark">{selectedAbsence?.description}</CustomText>
          </Fields>
          <Fields>
            <CustomText color="darkCyan" fontSizes='body3'>{t(notificationLanguage.ABSENTEEISM_STATUS)}</CustomText>
            <CustomText color="dark">
              {selectedAbsence?.isApproved === "pending" && `${t("WAITING_FOR_APPROVAL")}` ||
                selectedAbsence?.isApproved === "approved" && `${t("APPROVED")}` ||
                selectedAbsence?.isApproved === "rejected" && `${t("REJECTED")}` ||
                "Durum bilinmiyor"}
            </CustomText>
          </Fields>

        </CardContentRight>
      </CardContentContainer>

    );
  };

  const EvaluationContent = () => {
    return (
      <CustomFlatList
        renderItem={({
          item,
          index,
        }: {
          item: EvulationQuestionResponse;
          index: number;
        }) => {
          return (
            <CardContentContainer key={index}>
              <CustomText fontSizes="body4" color="textLink">{`${index + 1
                }.`}</CustomText>
              <CardContentRight>
                <CustomText color="primaryText">
                  {item.question.name}
                </CustomText>
                <CustomText color="textLink">
                  {item.answer.map(answer => answer).join(', ')}
                </CustomText>
              </CardContentRight>
            </CardContentContainer>
          );
        }}
        data={selectedEvulation.evulationQuestions}
        isBottomSheet
      />
    );
  };

  return (
    <Container
      goBackShow
      header
      title={t('STUDENT_INFO')}
      extraIcon={faTrash}
      extraIconPress={() => {
        pressToDelete();
      }}>
      <Loading>
        <Container p={10} type="container">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: colors.background,
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
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
                        setSelectedEvulation(evulation);
                        evulationBottomSheetRef.current?.open();
                      }}
                      key={index}>
                      <CustomText color="primaryText">
                        {evulation.date}
                      </CustomText>
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
                  {absenteeisms.map((absence: any, index: number) => (
                    <AbsenceCard
                      onPress={() => {
                        setSelectedAbsence(absence)
                        absenceBottomSheetRef.current?.open()
                      }}
                      key={index}>
                      <CustomText color="primaryText">
                        {absence?.startDate}
                      </CustomText>
                      <FontAwesomeIcon
                        color={colors.iconColor}
                        icon={faAngleRight}
                      />
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
        </Container>
      </Loading>
      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <ImageViewer imageUrls={selectedImage} />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ position: 'absolute', top: 40, right: 20 }}>
            <CustomText color="white">Close</CustomText>
          </TouchableOpacity>
        </Modal>
      )}
      <CustomBottomSheet
        snapPoints={['80%', '50%']}
        ref={absenceBottomSheetRef}>
        <AbsenceContent />
      </CustomBottomSheet>
      <CustomBottomSheet
        snapPoints={['70%', '80%']}
        ref={evulationBottomSheetRef}>
        <EvaluationContent />
      </CustomBottomSheet>
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
  margin: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex:1;
  margin-bottom: 10px;
`;

const ButtonContainer = styled(View)`
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
`;

const CardContentRight = styled(View)`
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;
const Fields = styled(View)`
  flex-direction: column;
  gap: 5px;
`;