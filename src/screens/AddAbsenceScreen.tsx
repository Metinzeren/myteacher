import {
  View,
  Keyboard,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/Container/Container';
import { useTranslation } from 'react-i18next';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import Input from '../components/Input/Input';
import {
  faAdd,
  faCalendar,
  faFileAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import Absenteeism from '../models/Absenteeism';
import uuid from 'react-native-uuid';
import { Calendar } from 'react-native-calendars';
import CustomBottomSheet, {
  BottomSheetRef,
} from '../components/CustomBottomSheet/CustomBottomSheet';
import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import styled from 'styled-components';
import IconButton from '../components/IconButton/IconButton';
import { getResourceByKey } from '../lang/i18n';
import AbsenteeismRepository from '../repositories/AbsenteeismRepository';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { getLocalStorage, getUserId } from '../utils/AsyncStorageUtils';
import UserRepository from '../repositories/UserRepository';
import CustomText from '../components/Text/Text';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { initStorage } from '../firebase/config';
import { format } from 'date-fns';
import NotificationModel from '../models/NotificationModel';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { sendNotification } from '../firebase/FirebaseApi';
import dayjs from 'dayjs';
import usePhoto from '../hooks/usePhoto';
export default function AddAbsenceScreen(
  props: NativeStackScreenProps<RootStackParamList, 'AddAbsenceScreen'>,
) {
  const { t } = useTranslation();
  const formRef = useRef<FormContainerRef>(null);
  const AbsenteeismRepo = AbsenteeismRepository.getInstance();
  const { photos, deletePhoto, initLaunchCamera, initLaunchImage } = usePhoto();
  const UserRepo = UserRepository.getInstance();
  const ClassRoomRepo = ClassRoomRepository.getInstance();
  const startDateBottomSheetRef = useRef<BottomSheetRef>(null);
  const endDateBottomSheetRef = useRef<BottomSheetRef>(null);
  const photoButtonRef = useRef<BottomSheetRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({} as any);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [registerDto, setRegisterDto] = useState<Absenteeism>({
    id: uuid.v4().toString(),
    studentId: '',
    classRoomId: '',
    startDate: '',
    endDate: '',
    description: '',
    photo: '',
    isApproved: 'pending',
    studentName: '',
  });

  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const StartDateCalendar = () => {
    return (
      <Calendar
        minDate={today}
        onDayPress={(day: any) => {
          handleChange('startDate', day.dateString);
          startDateBottomSheetRef.current?.close();
        }}
      />
    );
  };

  const EndDateCalendar = () => {
    return (
      <Calendar
        minDate={today && registerDto.startDate}
        onDayPress={(day: any) => {
          handleChange('endDate', day.dateString);
          endDateBottomSheetRef.current?.close();
        }}
      />
    );
  };

  const PhotoButtonContent = () => {
    return (
      <Buttons>
        <Button
          text="Select Image"
          onPress={() => {
            photoButtonRef.current?.close();
            initLaunchImage()
          }}
        />
        <Button
          text="Take Photo"
          onPress={() => {
            photoButtonRef.current?.close();
            initLaunchCamera();
          }}
        />
      </Buttons>
    );
  };
  const getUser = async () => {
    const user = await getLocalStorage('AUTH_USER');
    const response = await UserRepo.getUser(user.uid);
    setUserInfo(response);
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      getUser();
    });
  }, []);

  const sendAbsenceNotification = async ({
    id,
    notificationType,
  }: {
    id: string;
    notificationType: string;
  }) => {
    let notificationLanguage = getResourceByKey('notifications');
    let userId = await getUserId();
    let classRoomId = await UserRepo.getClassRoomIdByUserId();

    let teachers = await ClassRoomRepo.getTeachersByClassRoomId(classRoomId);

    let data = {
      from: userId,
      to: [teachers[0]],
      data: {
        id,
        notificationType,
        studentId: userInfo.studentId,
        classRoomId: userInfo.classRoomId
      },
      title: notificationLanguage.ABSENTEEISM_NOTIFICATION_TITLE,
      body: `${notificationLanguage.ABSENTEEISM_NOTIFICATION_BODY}`,
      isApproved: 'pending',
      isRead: false,
      createdDate: new Date().toISOString(),
    } as NotificationModel;
    console.log(data.to);

    await sendNotification(data)
      .then(e => {
        console.log('Notification sent:' + e);
      })
      .catch(e => {
        console.log('Notification error:' + e);
      });
  };
  const handleAddAbsence = async () => {
    let isEmpty = formRef.current?.validate(getResourceByKey('addAbsenceForm'));
    if (isEmpty) {
      Keyboard.dismiss();
      setLoading(true);
      let photoUrl = '';

      if (photos.length > 0) {
        let bytes = await fetch(photos[0]).then(res => res.blob());
        let storageRef = ref(
          initStorage,
          `absenteeism/${userInfo.id}/${registerDto.id}`,
        );
        await uploadBytes(storageRef, bytes);
        photoUrl = await getDownloadURL(storageRef);
      }

      let data = {
        studentId: userInfo.studentId,
        startDate: registerDto.startDate,
        endDate: registerDto.endDate,
        description: registerDto.description,
        photo: photoUrl,
        classRoomId: userInfo.classRoomId,
        isApproved: registerDto.isApproved,
        studentName: `${userInfo.firstName} ${userInfo.lastName}`,
      };
      try {
        let response = await AbsenteeismRepo.addAbsenteeism(data);
        await sendAbsenceNotification({
          id: response.id || '',
          notificationType: 'absence',
        });
        AlertDialog.showModal({
          title: t('SUCCESS'),
          message: t('CLASS_ADD_SUCCESS'),
          onConfirm() {
            props.navigation.goBack();
          },
          disableCloseOnTouchOutside: true,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setImageUri(null);
      }
    }
  };

  return (
    <Container goBackShow title={t('STUDENT_ABSENCE')} header>
      <Container p={10} type="container">
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
                onPress={() => photoButtonRef.current?.open()}
                icon={faAdd}
              />
            </IconContainer>
            <ImageContainer>
              {photos.length > 0 && (
                <>
                  <StyledImage source={{ uri: photos[0] }} />
                  <DeleteIconContainer>
                    <IconButton
                      iconSize={15}
                      backgroundColor="#fff"
                      iconColor="orange"
                      onPress={() => {
                        deletePhoto(0);
                        setImageUri(null);
                      }}
                      icon={faTrash}
                    />
                  </DeleteIconContainer>
                </>)}

            </ImageContainer>
          </AddPhotoContainer>

          <PlaceholderInput
            required
            icon={faCalendar}
            id="startDate"
            value={
              registerDto.startDate
                ? dayjs(registerDto?.startDate).format('DD.MM.YYYY')
                : ` ${t('START_DATE')}`
            }
            onPress={() => {
              startDateBottomSheetRef.current?.open();
            }}
          />
          <PlaceholderInput
            required
            icon={faCalendar}
            id="endDate"

            value={registerDto.endDate ? dayjs(registerDto?.endDate).format('DD.MM.YYYY') : ""}
            placeholder={
              registerDto.endDate
                ? dayjs(registerDto?.endDate).format('DD.MM.YYYY')
                : ` ${t('END_DATE')}`
            }
            onPress={() => {
              endDateBottomSheetRef.current?.open();
            }}
          />
          <Input
            required
            id="description"
            placeholder={t('DESCRIPTION')}
            icon={faFileAlt}
            value={registerDto?.description}
            onChangeText={e => handleChange('description', e)}
          />
        </FormContainer>
      </Container>
      <ButtonContainer>
        <Button
          loading={loading}
          borderRadius={10}
          onPress={() => {
            handleAddAbsence();
          }}
          text={t('KAYDET')}
        />
      </ButtonContainer>
      <CustomBottomSheet
        snapPoints={['45%', '55%']}
        ref={startDateBottomSheetRef}>
        <StartDateCalendar />
      </CustomBottomSheet>
      <CustomBottomSheet
        snapPoints={['45%', '55%']}
        ref={endDateBottomSheetRef}>
        <EndDateCalendar />
      </CustomBottomSheet>
      <CustomBottomSheet snapPoints={['20%', '40%']} ref={photoButtonRef}>
        <PhotoButtonContent />
      </CustomBottomSheet>
    </Container>
  );
}

const Buttons = styled(View)`
  flex-direction: column;
  gap: 10px;
  margin-horizontal: 10px;
`;
const ButtonContainer = styled(View)`
  margin-horizontal: 10px;
  margin-bottom: 20px;
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

const IconContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
  padding: 0px 5px;
  height: 100px;
`;

const DeleteIconContainer = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
`;
