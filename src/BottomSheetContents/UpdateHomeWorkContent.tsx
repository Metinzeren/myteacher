
import dayjs from 'dayjs';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import Loading from '../components/Loading/Loading';
import CheckboxButton from '../components/CheckboxButton/CheckboxButton';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import HomeWorkClassRoom from '../models/HomeWorkClassRoom';
import Student from '../models/Student';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import CustomText from '../components/Text/Text';
import IconButton from '../components/IconButton/IconButton';
import uuid from 'react-native-uuid';
import Input from '../components/Input/Input';
import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import usePhoto from '../hooks/usePhoto';
import Modal from 'react-native-modals';
import Container from '../components/Container/Container';
import NotificationModel from '../models/NotificationModel';
import React, { useEffect, useRef, useState } from 'react';
import Homework, { HomeWorkType } from '../models/Homework';
import FormContainer, { FormContainerRef } from 'react-native-form-container';
import {
    View,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {
    faAngleLeft,
    faCalendar,
    faCamera,
    faImage,
    faTrash,
    faUser,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { useHomeworks } from '../context/HomeworkContext';
import { Calendar } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { getUserAccesToken, getUserId } from '../utils/AsyncStorageUtils';
import { addHomeworkandSendNotification, sendNotification } from '../firebase/FirebaseApi';
import { getResourceByKey } from '../lang/i18n';
import { initStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import HomeworkRepository from '../repositories/HomeworkRepository';


export default function UpdateHomeWorkContent(

) {
    const { t } = useTranslation();
    const { setBottomSheetType, updateHomework, bottomSheetType, handleChangeSelectedHomeWork, setHomework, addHomework, selectedHomework, setSelectedHomework } =
        useHomeworks();
    const formRef = useRef<FormContainerRef>(null);
    const today = new Date().toISOString().split('T')[0];
    const { photos, deletePhoto, initLaunchCamera, initLaunchImage, setPhotos } = usePhoto();
    const [startDateShow, setStartDateShow] = React.useState(false);
    const [endDateShow, setEndDateShow] = React.useState(false);
    const classRoomRepo = ClassRoomRepository.getInstance();
    const homeworkRepo = HomeworkRepository.getInstance();
    const [loading, setLoading] = React.useState(true);
    const [classRooms, setClassRooms] = React.useState<Array<ClassRoom>>([]);
    const [selectedClassRoom, setSelectedClassRoom] = React.useState<ClassRoom>(
        {} as ClassRoom,
    );
    useEffect(() => {
        setPhotos(selectedHomework?.photos ? selectedHomework?.photos : []);
    }, [selectedHomework]);
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
                        {classRooms?.length > 0 ? (
                            classRooms?.map((classRoom, index) => (
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
                        {selectedClassRoom?.students?.map((student, index) => {
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
        let findClassRoom = selectedHomework?.classRoom.find(
            classRoom => classRoom.id === selectedClassRoom.id,
        );
        const [checked, setChecked] = React.useState<boolean>(
            (selectedHomework?.classRoom.find(x => x.students.find(y => y === student.id) || false) !== undefined ? true : false)
        );
        const handleSelect = () => {
            if (findClassRoom) {
                const findStudent = findClassRoom.students.findIndex(
                    studentId => studentId === student.id,
                );

                if (findStudent !== -1) {
                    findClassRoom.students.splice(findStudent, 1);
                    if (findClassRoom.students.length === 0) {
                        let newClassRooms = selectedHomework?.classRoom.filter(
                            classRoom => classRoom.id !== selectedClassRoom.id,
                        ) as any;
                        handleChangeSelectedHomeWork('classRoom', newClassRooms);
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
                let newClassRooms = [...selectedHomework?.classRoom as any, newClassRoom] as any;
                handleChangeSelectedHomeWork('classRoom', newClassRooms);
            }
            setChecked(!checked);
        };
        return (
            <CheckboxContainer key={index} onPress={handleSelect}>
                <CheckboxButton
                    onPress={handleSelect}
                    checked={checked ? true : false}
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
            title: selectedHomework?.homeworkTitle,
            body: selectedHomework?.description,
        } as NotificationModel;
        await sendNotification(data)
            .then(e => {
                console.log('Notification sent:' + e);
            })
            .catch(e => {
                console.log('Notification error:' + e);
            });
    };

    const handleUpdateHomework = async () => {
        let isEmpty = formRef.current?.validate(getResourceByKey('addHomeworksForm'));
        if (!isEmpty) {
            return;
        }
        setLoading(true)
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
        setSelectedHomework({ ...selectedHomework!, photos: photoUrls })

        if (accessToken) {
            try {
                await homeworkRepo.updateHomework({
                    ...selectedHomework as Homework,
                });
                updateHomework(selectedHomework as Homework);
                await sendNotificationToParents({
                    id: selectedHomework?.id as string,
                    notificationType: 'updateHomework',
                });
            } catch (error) {
                console.error('Error during add homework:', error);
            }
            finally {
                setLoading(false)
                AlertDialog.showModal({
                    title: t('SUCCESS'),
                    message: t('CLASS_ADD_SUCCESS'),
                    onConfirm() {
                    },
                    disableCloseOnTouchOutside: true,
                });
            }

        }

    }

    return (
        <Loading loading={loading}>
            {bottomSheetType === 'saveStep' ? (
                <Container bgColor="white" p={10} type="container">
                    <BottomSheetScrollView>
                        <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
                            <View>
                                <CustomText fontSizes="body4" color="primaryText">
                                    {t('UPDATE_PHOTO')}{' '}
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
                                            {photos?.map((photo, index) => (
                                                <View key={index}>
                                                    <StyledImage source={{ uri: photo }} />
                                                    <DeleteIconContainer>
                                                        <IconButton
                                                            iconSize={15}
                                                            backgroundColor="#fff"
                                                            iconColor="orange"
                                                            onPress={() => {
                                                                let checkHttps = photo.includes('https');
                                                                if (checkHttps) {
                                                                    console.log("firebaseden sil ardından stateden sil")
                                                                }
                                                                else {
                                                                    deletePhoto(index);
                                                                }

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
                                value={selectedHomework?.homeworkTitle}
                                onChangeText={text =>
                                    setSelectedHomework({ ...selectedHomework!, homeworkTitle: text })
                                }
                                required
                                id="title"
                                placeholder="Ödev adı"
                                icon={faUser}
                            />
                            <Input
                                value={selectedHomework?.description}
                                onChangeText={text => setSelectedHomework({ ...selectedHomework!, description: text })}
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
                                    selectedHomework?.classRoom.length === 0
                                        ? ''
                                        : selectedHomework?.classRoom
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
                                        value={dayjs(selectedHomework?.startDate).format('DD/MM/YYYY')}
                                        onPress={() => setStartDateShow(true)}
                                        id="startDate"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <PlaceholderInput
                                        icon={faCalendar}
                                        onPress={() => setEndDateShow(true)}
                                        placeholder="Bitiş Tarihi"
                                        value={dayjs(selectedHomework?.endDate).format('DD/MM/YYYY')}
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
                                    onPress={() => {

                                        handleChangeSelectedHomeWork('homeWorkType', 'Quiz')

                                    }}
                                    outline={selectedHomework?.homeWorkType !== 'Quiz'}
                                    style={{ flex: 1 }}
                                    text="Quiz"
                                />
                                <Button
                                    onPress={() => {
                                        handleChangeSelectedHomeWork('homeWorkType', 'Test')
                                    }}
                                    outline={selectedHomework?.homeWorkType !== 'Test'}
                                    text={'Test'}
                                    style={{ flex: 1 }}
                                />
                            </ButtonContainer>
                        </FormContainer>
                    </BottomSheetScrollView>
                    <View style={{ marginBottom: Platform.OS === 'ios' ? 20 : 10 }}>
                        <Button onPress={() => handleUpdateHomework()} text={t("SAVE")} />
                    </View>
                    <Modal
                        onTouchOutside={() => {
                            setStartDateShow(false);
                        }}
                        style={{ padding: 10 }}
                        visible={startDateShow}>
                        <Calendar
                            initialDate={selectedHomework?.startDate ? selectedHomework.startDate : today}
                            minDate={selectedHomework?.startDate ? selectedHomework.startDate : today}
                            onDayPress={(day: any) => {
                                handleChangeSelectedHomeWork('startDate', day.dateString);

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
                            minDate={selectedHomework?.endDate ? selectedHomework.endDate : today}
                            onDayPress={(day: any) => {

                                handleChangeSelectedHomeWork('endDate', day.dateString);

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
    )
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
