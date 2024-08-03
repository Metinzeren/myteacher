import {PermissionsAndroid, Platform} from 'react-native';
import {useEffect, useState} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
export default function useFcmToken() {
  const [fcmToken, setFcmToken] = useState('');
  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestPermissions();
    } else {
      requestPermissions();
    }
  }, []);

  const registerForRemoteMessages = () => {
    firebase
      .messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        requestPermissions();
      })
      .catch(e => console.log(e));
  };
  const requestPermissions = () => {
    firebase
      .messaging()
      .requestPermission()
      .then((status: FirebaseMessagingTypes.AuthorizationStatus) => {
        if (status === 1) {
          getToken();
        } else {
          console.log('Not authorized');
        }
      })
      .catch(e => console.log(e));
  };
  const getToken = async () => {
    messaging()
      .getToken()
      .then(token => {
        setFcmToken(token);
      })
      .catch(e => console.log(e));
  };

  return {fcmToken};
}
