import { firebase, FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function useFcmToken() {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    useEffect(() => {
        if (Platform.OS === 'ios') {
            registerForRemoteMessage();
        } else {
            requestForPermission();
        }

    }, []);
    const registerForRemoteMessage = async () => {
        firebase.messaging().registerDeviceForRemoteMessages()
            .then(() => {
                requestForPermission()
            }).catch((error: any) => {
                console.log('Error', error)
            })
    }

    const requestForPermission = async () => {
        firebase.messaging().requestPermission()
            .then((status: FirebaseMessagingTypes.AuthorizationStatus) => {
                if (status === 1) {
                    getToken()
                } else {
                    console.log('Permission denied')
                }

            }).catch((error: any) => {
                console.log('Permission denied', error)
            })
    }

    const getToken = async () => {
        const token = await firebase.messaging().getToken();
        if (token) {
            setFcmToken(token)
        } else {
            requestForPermission()
        }
    }
    return fcmToken;
}