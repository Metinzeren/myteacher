import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import NotificationRepository from '../repositories/NotificationRepository';
import Loading from '../components/Loading/Loading';
import { getUserId } from '../utils/AsyncStorageUtils';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomText from '../components/Text/Text';
import Button from '../components/Button/Button';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import dayjs from 'dayjs';
import useThemeColors from '../constant/useColor';
import NotificationModel from '../models/NotificationModel';
import StudentRepository from '../repositories/StudentRepository';
import UserRepository from '../repositories/UserRepository';

export default function NotificationScreen(
  props: NativeStackScreenProps<RootStackParamList, 'NotificationScreen'>,
) {
  const NotificationRepo = NotificationRepository.getInstance();
  const UserRepo = UserRepository.getInstance();
  let notificationLanguage = getResourceByKey('notifications');
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getNotificationsByUserId();
    });

    return unsubscribe;
  }, []);

  const getNotificationsByUserId = async () => {
    let userId = await getUserId();
    setLoading(true);
    await NotificationRepo.getNotificationsByUserId(userId)
      .then(res => {
        setNotifications(res);

      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getStudentId()
  }, [])

  const getStudentId = async () => {
    const response = await UserRepo.getParentDetailsByUserId(notifications.map(item => item.from)[0]);
    console.log(response);
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

  const RenderItem = ({ item, index }: { item: NotificationModel; index: number }) => {

    return (
      <ListItem

        style={{ backgroundColor: item.isRead ? '#fff' : colors.notRead }}
        // onPress={() =>
        //   props.navigation.navigate('UpdateStudentScreen', {
        //     studentId: item.newStudentId as string,
        //     classRoomId: classRoomId,
        //   })
        // }
        key={index}>
        <ListItemContainer>
          <CustomText color={item.isRead ? "grey" : "white"}>{notificationLanguage.NOT}:</CustomText>
          <CustomText color={item.isRead ? "grey" : "white"}>
            {item?.title}
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color={item.isRead ? "grey" : "white"}>{t("STUDENT_NO")}:</CustomText>
          <CustomText color={item.isRead ? "grey" : "white"}>{item.isRead}</CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color={item.isRead ? "grey" : "white"}>{notificationLanguage.NOT_DATE}:</CustomText>
          <CustomText color={item.isRead ? "grey" : "white"}>
            {renderDate(item.createdDate)}
          </CustomText>
        </ListItemContainer>
      </ListItem>
    );
  };
  return (
    <Container goBackShow header title="Bildirimler">
      <Loading loading={loading}>
        <Container type="container" p={10}>
          <CustomFlatList
            data={notifications}
            renderItem={RenderItem}
          />
        </Container>
      </Loading>
    </Container>
  );
}




const ListItem = styled(TouchableOpacity)`
  padding: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: column;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;
