import { View, Text, Image, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import NotificationRepository from '../repositories/NotificationRepository';
import Loading from '../components/Loading/Loading';
import { getUserFromCollection, getUserId } from '../utils/AsyncStorageUtils';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomText from '../components/Text/Text';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import useThemeColors from '../constant/useColor';
import NotificationModel from '../models/NotificationModel';
import NotificationResponse from '../models/NotificationResponse';
import IconButton from '../components/IconButton/IconButton';
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons';
import CustomBottomSheet, { BottomSheetRef } from '../components/CustomBottomSheet/CustomBottomSheet';
import AbsenteeismRepository from '../repositories/AbsenteeismRepository';
import Absenteeism from '../models/Absenteeism';
import ImageViewer from 'react-native-image-zoom-viewer';
import dayjs from 'dayjs';
import Button from '../components/Button/Button';

export default function NotificationScreen(
  props: NativeStackScreenProps<RootStackParamList, 'NotificationScreen'>,
) {
  const NotificationRepo = NotificationRepository.getInstance();
  const AbsenceRepo = AbsenteeismRepository.getInstance();
  let notificationLanguage = getResourceByKey('notifications');
  const [loading, setLoading] = useState(false);
  const notificationsApprovedRef = useRef<BottomSheetRef>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>([])
  const [loadingAbsence, setLoadingAbsence] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState({} as NotificationResponse);
  const [selectedAbsence, setSelectedAbsence] = useState<Absenteeism | undefined>(undefined);
  const colors = useThemeColors();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getNotificiationWithStudents();
    });

    return unsubscribe;
  }, []);




  const getNotificiationWithStudents = async () => {
    let userInfo = await getUserFromCollection();

    setLoading(true);
    await NotificationRepo.getNotificationWithStudents(userInfo.id)
      .then(res => {
        setNotifications(res);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const renderDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };


  const RenderItem = ({ item, index }: { item: NotificationResponse; index: number }) => {

    return (
      <ListItem
        onPress={() => {
          getAbsenceById(item);
          notificationsApprovedRef.current?.open()
        }}
        key={index}>
        {item.isRead ? (
          <View style={{ flex: 0.12 }} >
            <IconButton backgroundColor={colors.success} borderRadius={50} icon={faCheck} />
          </View>

        ) : (
          <View style={{ flex: 0.12 }}>
            <IconButton borderRadius={50} icon={faExclamation} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <ListItemContainer >
            <CustomText color={"dark"}>{notificationLanguage.NOT}:</CustomText>
            <CustomText color={"dark"}>
              {item?.title}
            </CustomText>
          </ListItemContainer>
          <ListItemContainer>
            <CustomText color={"dark"}>{t("STUDENT_NAME")}:</CustomText>
            <CustomText color={"dark"}>{`${item?.student.firstName} ${item?.student.lastName}`}</CustomText>
          </ListItemContainer>
          <ListItemContainer>
            <CustomText color={"dark"}>{notificationLanguage.NOT_DATE}:</CustomText>
            <CustomText color={"dark"}>
              {renderDate(item.createdDate)}
            </CustomText>
          </ListItemContainer>
        </View>

      </ListItem>
    );
  };

  const getAbsenceById = async (notification: NotificationResponse) => {
    setLoadingAbsence(true);
    try {
      const absence = await AbsenceRepo.getAbsenteeism(notification.data.id);
      setSelectedAbsence(absence);
      setSelectedNotification(notification);
    } catch (error) {
      console.error('Error fetching absence:', error);
    }
    setLoadingAbsence(false);
  };
  const ApprovedContent = () => {

    return (
      <Container type='container'>
        <Loading loading={loadingAbsence}>
          <ApprovedContentContainer
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
          >
            <ApprovedTopContainer>

              {
                selectedAbsence?.photo && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage([{ url: selectedAbsence.photo }] as any);
                      setShowPhotoModal(true);
                    }}
                  >
                    <Image
                      source={{ uri: selectedAbsence.photo }}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 8,
                      }}
                    />
                  </TouchableOpacity>
                )
              }
            </ApprovedTopContainer>

            <ApprovedBottomContainer>
              <BottomContent>
                <View>
                  <CustomText color="darkCyan" fontSizes='body3'>{t("DESCRIPTION")}</CustomText>
                  <CustomText color="dark">{selectedAbsence?.description}</CustomText>
                </View>
                <View>
                  <CustomText color="darkCyan" fontSizes='body3'>{t("ABSENCE_DATE")}</CustomText>
                  <CustomText color="dark">{dayjs(selectedAbsence?.startDate).format('DD.MM.YYYY')} - {dayjs(selectedAbsence?.endDate).format('DD.MM.YYYY')}</CustomText>
                </View>

              </BottomContent>

              <BottomButtonContainer>
                <Button text={t("APPROVE")} />
                <Button backgroundColor='#E57373' text={t("REJECT")} />
              </BottomButtonContainer>
            </ApprovedBottomContainer>
          </ApprovedContentContainer>
          {showPhotoModal && (
            <Modal
              visible={showPhotoModal}
              transparent={true}
              onRequestClose={() => setShowPhotoModal(false)}>
              <ImageViewer imageUrls={selectedImage} />
              <TouchableOpacity
                onPress={() => setShowPhotoModal(false)}
                style={{ position: 'absolute', top: 0, right: 0 }}>
                <CustomText color="white">Close</CustomText>
              </TouchableOpacity>
            </Modal>
          )}
        </Loading>
      </Container>
    );
  }


  return (
    <Container goBackShow header title="Bildirimler">
      <Loading loading={loading}>
        <Container type="container">
          <CustomFlatList
            data={notifications}
            renderItem={RenderItem}
          />
        </Container>
      </Loading>
      <CustomBottomSheet
        snapPoints={['70%', '80%']}
        ref={notificationsApprovedRef}>
        <ApprovedContent />
      </CustomBottomSheet>

    </Container>
  );
}




const ListItem = styled(TouchableOpacity)`
  padding: 15px;
  flex-direction: row;
  background-color: #fff;
  align-items:center;
  gap: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
`;

const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const ApprovedContentContainer = styled(View)`
  flex: 1;
  justify-content: flex-start;
  padding: 20px;
`;
const ApprovedTopContainer = styled(View)`
  align-items: center;
`;
const ApprovedBottomContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
  background-color: #fff;
`;

const BottomContent = styled(View)`
  width: 100%;
  flex:1;
  flex-direction: column;
  gap: 10px;
`;
const BottomButtonContainer = styled(View)`
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
`;