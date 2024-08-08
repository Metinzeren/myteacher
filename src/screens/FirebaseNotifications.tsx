import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

import AlertDialog from '../components/AlertDialog/AlertDialog';
import { getResourceByKey } from '../lang/i18n';
export default function FirebaseNotifications() {

  const notificationLanguage = getResourceByKey("notifications");
  useEffect(() => {
    console.log('Firebase Notifications');
    const onMessage = messaging().onMessage(async remoteMessage => {
      getNotificationContent(remoteMessage.data, remoteMessage);
    });
    const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        getNotificationContent(remoteMessage.data, remoteMessage);
      },
    );
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          getNotificationContent(remoteMessage.data, remoteMessage);
        }
      });

    return () => {
      onMessage();
      onNotificationOpenedApp();
    };
  }, []);
  let getTranslatedText = (key: string) => {
    return notificationLanguage[key];
  };
  const getNotificationContent = (data: any, remoteMessage?: any) => {
    // let notificationType = data?.notificationType;
    let isTranslate = data?.isTranslate;
    let notificationTitle = remoteMessage?.notification?.title;
    let notificationBody = remoteMessage?.notification?.body;
    AlertDialog.showModal({
      title: isTranslate === "true" ? getTranslatedText(notificationTitle) : notificationTitle,
      message: isTranslate === "true" ? getTranslatedText(notificationBody) : notificationBody,
    });
    return null;
  };
  return null;
}
