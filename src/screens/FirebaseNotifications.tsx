import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import AlertDialog from '../components/AlertDialog/AlertDialog';
export default function FirebaseNotifications() {
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

  const getNotificationContent = (data: any, remoteMessage?: any) => {
    let notificationType = data?.notificationType;
    let notificationTitle = remoteMessage?.notification?.title;
    let notificationBody = remoteMessage?.notification?.body;
    console.log(data, remoteMessage);
    AlertDialog.showModal({
      title: notificationTitle,
      message: notificationBody,
    });
    return null;
  };
}
