import {
  View,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/Container/Container';
import { useTranslation } from 'react-i18next';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import FormContainer, { FormContainerRef } from 'react-native-form-container';
import CustomText from '../components/Text/Text';
import IconButton from '../components/IconButton/IconButton';
import uuid from 'react-native-uuid';
import {
  faAngleLeft,
  faCalendar,
  faCamera,
  faImage,
  faTrash,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Input from '../components/Input/Input';
import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import usePhoto from '../hooks/usePhoto';
import Modal from 'react-native-modals';

import { useHomeworks } from '../context/HomeworkContext';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import Loading from '../components/Loading/Loading';
import CheckboxButton from '../components/CheckboxButton/CheckboxButton';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import HomeWorkClassRoom from '../models/HomeWorkClassRoom';
import Student from '../models/Student';
import { getUserAccesToken, getUserId } from '../utils/AsyncStorageUtils';
import { addHomeworkandSendNotification, sendNotification } from '../firebase/FirebaseApi';
import { getResourceByKey } from '../lang/i18n';
import { initStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { HomeWorkType } from '../models/Homework';
import NotificationModel from '../models/NotificationModel';

export default function AddHomeWorkContent() {
  const { t } = useTranslation();
  const { setBottomSheetType, bottomSheetType, homework, handleChangeHomeWork, setHomework, addHomework } =
    useHomeworks();
  const formRef = useRef<FormContainerRef>(null);
  const today = new Date().toISOString().split('T')[0];
  const { photos, deletePhoto, initLaunchCamera, initLaunchImage, setPhotos } = usePhoto();
  const [startDateShow, setStartDateShow] = React.useState(false);
  const homeworksLangugage = useTranslation('homeworks').t;
  const [endDateShow, setEndDateShow] = React.useState(false);
  const classRoomRepo = ClassRoomRepository.getInstance();
  const [loadingAddHomework, setLoadingAddHomework] = useState(false)
  const [loading, setLoading] = React.useState(true);
  const [classRooms, setClassRooms] = React.useState<Array<ClassRoom>>([]);
  const [selectedClassRoom, setSelectedClassRoom] = React.useState<ClassRoom>(
    {} as ClassRoom,
  );
  useEffect(() => {
    loadClassRoom();
  }, []);
  const loadClassRoom = () => {
    setLoading(true);
    classRoomRepo
      .getAllClassRooms()
      .then(classRooms => {
        setClassRooms(classRooms);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const ClassRoomListStep = () => {
    return (
      <Container type="container" p={10} bgColor="white">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ position: 'absolute', left: 0 }}>
            <IconButton
              icon={faAngleLeft}
              onPress={() => setBottomSheetType('saveStep')}
            />
          </View>
          <CustomText fontSizes="body2" color="primaryText">
            Sınıf Seçimi
          </CustomText>
        </View>

        <Loading loading={loading}>
          <ClassRoomContainer>
            {classRooms.length > 0 ? (
              classRooms.map((classRoom, index) => (
                <PlaceholderInput

                  key={index}
                  onPress={() => {
                    setSelectedClassRoom(classRoom);
                    setBottomSheetType('studentList');
                  }}
                  icon={faUsers}
                  placeholder={classRoom.name}
                />
              ))
            ) : (
              <CustomText fontSizes="body4" color="primaryText">
                Sınıf bulunamadı
              </CustomText>
            )}
          </ClassRoomContainer>
        </Loading>
      </Container>
    );
  };
  const StudentListStep = () => {
    return (
      <Container p={10} bgColor="white" type="container">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ position: 'absolute', left: 0 }}>
            <IconButton
              icon={faAngleLeft}
              onPress={() => setBottomSheetType('classRoomList')}
            />
          </View>
          <CustomText fontSizes="body2" color="primaryText">
            {selectedClassRoom.name} Sınıfı Öğrenci Seçimi
          </CustomText>
        </View>
        <StudentContainer>
          <StudentContainer>
            {selectedClassRoom.students?.map((student, index) => {
              return (
                <StudentCard key={index} index={index} student={student} />
              );
            })}
          </StudentContainer>
        </StudentContainer>
      </Container>
    );
  };
  const StudentCard = ({ index, student }: { index: number; student: Student }) => {
    let findClassRoom = homework.classRoom.find(
      classRoom => classRoom.id === selectedClassRoom.id,
    );
    const [checked, setChecked] = React.useState(
      findClassRoom?.students.find(x => x === student.id) ? true : false,
    );
    const handleSelect = () => {
      if (findClassRoom) {
        const findStudent = findClassRoom.students.findIndex(
          studentId => studentId === student.id,
        );
        if (findStudent !== -1) {
          findClassRoom.students.splice(findStudent, 1);
          if (findClassRoom.students.length === 0) {
            let newClassRooms = homework.classRoom.filter(
              classRoom => classRoom.id !== selectedClassRoom.id,
            ) as any;
            handleChangeHomeWork('classRoom', newClassRooms);
          }
        } else {
          findClassRoom.students.push(student?.id as string);
        }
      } else {
        let newClassRoom = {
          id: selectedClassRoom.id,
          className: selectedClassRoom.name,
          students: [student.id],
        } as HomeWorkClassRoom;
        let newClassRooms = [...homework.classRoom, newClassRoom] as any;
        handleChangeHomeWork('classRoom', newClassRooms);
      }
      setChecked(!checked);
    };
    return (
      <CheckboxContainer key={index} onPress={handleSelect}>
        <CheckboxButton
          onPress={handleSelect}
          checked={checked}
          label={student.firstName + ' ' + student.lastName}
        />
      </CheckboxContainer>
    );
  };

  const sendNotificationToParents = async ({
    id,
    notificationType,
  }: {
    id: string;
    notificationType: string;
  }) => {
    let userId = await getUserId();
    let parentIds = selectedClassRoom.students.map(x => x.parentId);
    let data = {
      from: userId,
      to: parentIds,
      data: {
        id,
        notificationType,
        studentId: '',
        classRoomId: '',
        isTranslate: '',
      },
      title: homework.homeworkTitle,
      body: homework.description,
    } as NotificationModel;
    await sendNotification(data)
      .then(e => {
        console.log('Notification sent:' + e);
      })
      .catch(e => {
        console.log('Notification error:' + e);
      });
  };

  const handleSaveHomework = async () => {
    let isEmpty = formRef.current?.validate(getResourceByKey('addHomeworksForm'));
    if (!isEmpty) {
      return;
    }
    setLoadingAddHomework(true)
    let userId = await getUserId();
    let accessToken = await getUserAccesToken();
    Keyboard.dismiss();
    let photoUrls = [];

    if (photos && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        let photo = photos[i];
        let bytes = await fetch(photo).then(res => res.blob());
        let storageRef = ref(
          initStorage,
          `homeworkPhotos/${userId}/${uuid.v4().toString()}`,
        );
        await uploadBytes(storageRef, bytes);
        let downloadUrl = await getDownloadURL(storageRef);
        photoUrls.push(downloadUrl);
      }
    }

    let data = {
      homeworkTitle: homework.homeworkTitle,
      description: homework.description,
      classRoom: homework.classRoom,
      startDate: homework.startDate,
      endDate: homework.endDate,
      homeWorkType: homework.homeWorkType,
      photos: photoUrls,
      teacherId: userId,
      id: uuid.v4().toString(),
      createdAt: new Date().toISOString(),
    }
    if (accessToken) {
      try {
        await addHomeworkandSendNotification({
          data: data,
          accessToken: accessToken,
        });
        addHomework(data);
        await sendNotificationToParents({
          id: data.id,
          notificationType: 'homework',
        });
      } catch (error) {
        console.error('Error during add homework:', error);
      }
      finally {
        setLoadingAddHomework(false)
        AlertDialog.showModal({
          title: t('SUCCESS'),
          message: t("HOMEWORK_ADD_SUCCESS"),
          onConfirm() {
          },
          disableCloseOnTouchOutside: true,
        });
        setHomework({
          id: '',
          homeworkTitle: '',
          description: '',
          teacherId: '',
          classRoom: [] as HomeWorkClassRoom[],
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
          homeWorkType: '' as HomeWorkType,
          createdAt: '',
          photos: [],
        })
        setPhotos([]);
      }

    }

  }




  return (
    <Loading loading={loadingAddHomework}>
      {bottomSheetType === 'saveStep' ? (
        <Container bgColor="white" p={10} type="container">
          <BottomSheetScrollView>
            <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
              <View>
                <CustomText fontSizes="body4" color="primaryText">
                  {t('ADD_PHOTO')}{' '}
                  <CustomText fontSizes="body6" color="textLink">
                    ({t('OPTIONAL')})
                  </CustomText>{' '}
                </CustomText>
              </View>
              <AddPhotoContainer>
                <IconContainer>
                  <IconButton
                    onPress={() => initLaunchImage()}
                    hitSlop={10}
                    icon={faImage}
                  />
                  <IconButton
                    onPress={() => initLaunchCamera()}
                    hitSlop={10}
                    icon={faCamera}
                  />
                </IconContainer>
                <ImageContainer>
                  {
                    <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
                      {photos.map((photo, index) => (
                        <View key={index}>
                          <StyledImage source={{ uri: photo }} />
                          <DeleteIconContainer>
                            <IconButton
                              iconSize={15}
                              backgroundColor="#fff"
                              iconColor="orange"
                              onPress={() => {
                                deletePhoto(index);
                              }}
                              icon={faTrash}
                            />
                          </DeleteIconContainer>
                        </View>
                      ))}
                    </ScrollView>
                  }
                </ImageContainer>
              </AddPhotoContainer>
              <Input
                value={homework.homeworkTitle}
                onChangeText={text =>
                  handleChangeHomeWork('homeworkTitle', text)
                }
                required
                id="title"
                placeholder="Ödev adı"
                icon={faUser}
              />
              <Input
                value={homework.description}
                onChangeText={text => handleChangeHomeWork('description', text)}
                required
                id="description"
                placeholder="Ödev açıklaması"
                icon={faUser}
              />
              <PlaceholderInput
                onPress={() => {
                  setBottomSheetType('classRoomList');
                }}
                value={
                  homework.classRoom.length === 0
                    ? ''
                    : homework.classRoom
                      .map(x => {
                        return x.className;
                      })
                      .join(', ')
                }
                icon={faUser}
                placeholder="Öğrenci Seçimi"
                required
                id="students"
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <View style={{ flex: 1 }}>
                  <PlaceholderInput
                    icon={faCalendar}
                    placeholder="Başlangıç Tarihi"
                    required
                    value={dayjs(homework.startDate).format('DD/MM/YYYY')}
                    onPress={() => setStartDateShow(true)}
                    id="startDate"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <PlaceholderInput
                    icon={faCalendar}
                    onPress={() => setEndDateShow(true)}
                    placeholder="Bitiş Tarihi"
                    value={dayjs(homework.endDate).format('DD/MM/YYYY')}
                    required
                    id="endDate"
                  />
                </View>
              </View>

              <CustomText color="primaryText" fontSizes="body4">
                Ödev Türü
              </CustomText>
              <ButtonContainer>
                <Button
                  onPress={() => handleChangeHomeWork('homeWorkType', 'Quiz')}
                  outline={homework.homeWorkType !== 'Quiz'}
                  style={{ flex: 1 }}
                  text="Quiz"
                />
                <Button
                  onPress={() => handleChangeHomeWork('homeWorkType', 'Test')}
                  outline={homework.homeWorkType !== 'Test'}
                  text={'Test'}
                  style={{ flex: 1 }}
                />
              </ButtonContainer>
            </FormContainer>
          </BottomSheetScrollView>
          <View style={{ marginBottom: Platform.OS === 'ios' ? 20 : 10 }}>
            <Button onPress={() => handleSaveHomework()} text={t("SAVE")} />
          </View>
          <Modal
            onTouchOutside={() => {
              setStartDateShow(false);
            }}
            style={{ padding: 10 }}
            visible={startDateShow}>
            <Calendar
              initialDate={homework.startDate ? homework.startDate : today}
              minDate={homework.startDate ? homework.startDate : today}
              onDayPress={(day: any) => {
                handleChangeHomeWork('startDate', day.dateString);
                if (dayjs(homework.endDate).isBefore(day.dateString)) {
                  handleChangeHomeWork('endDate', day.dateString);
                }
                setStartDateShow(false);
              }}
            />
          </Modal>
          <Modal
            onTouchOutside={() => {
              setEndDateShow(false);
            }}
            style={{ padding: 10 }}
            visible={endDateShow}>
            <Calendar
              minDate={homework.endDate ? homework.endDate : today}
              onDayPress={(day: any) => {
                handleChangeHomeWork('endDate', day.dateString);
                setEndDateShow(false);
              }}
            />
          </Modal>
        </Container>
      ) : bottomSheetType === 'classRoomList' ? (
        <ClassRoomListStep />
      ) : (
        <StudentListStep />
      )}
    </Loading>
  );
}

const IconContainer = styled(View)`
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
  padding: 0px 5px;
  height: 100px;
  width: 60px;
  gap: 10px;
`;

const DeleteIconContainer = styled(View)`
  position: absolute;
  top: -5px;
  right: -2px;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
`;

const AddPhotoContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
`;

const ImageContainer = styled(View)`
  position: relative;
  height: 100px;
`;
const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
`;
const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 10px;
`;
const ClassRoomContainer = styled(View)`
  flex: 1;
  margin-top: 20px;
  gap: 10px;
`;
const StudentContainer = styled(View)`
  flex: 1;
  margin-top: 20px;
  gap: 10px;
`;
const CheckboxContainer = styled(TouchableOpacity)`
  flex-direction: row;
  gap: 10px;
  border: 1px solid #ebeff3;
  padding: 10px;
  border-radius: 10px;
`;
