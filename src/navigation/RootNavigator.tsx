import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import {useEffect, useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase/config';
import HomeScreen from '../screens/HomeScreen';
import {RootStackParamList} from '../types/Navigation';
import StudentsScreen from '../screens/StudentsScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import CalendarScreen from '../screens/HomeWorkScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import UpdateStudentScreen from '../screens/UpdateStudentScreen';
import ClassRoomScreen from '../screens/ClassRoomScreen';
import AddClassScreen from '../screens/AddClassScreen';
import UpdateClassScreen from '../screens/UpdateClassScreen';
import NotificationScreen from '../screens/NotificationScreen';
import StudentEvulationScreen from '../screens/StudentEvulationScreen';
import {getLocalStorage, setLocalStorage} from '../utils/AsyncStorageUtils';
import AddStudentEvulationScreen from '../screens/AddStudentEvulationScreen';
import UpdateStudentEvulationScreen from '../screens/UpdateStudentEvulationScreen';
import AddAbsenceScreen from '../screens/AddAbsenceScreen';
import FirebaseNotifications from '../screens/FirebaseNotifications';
import UserRepository from '../repositories/UserRepository';
import SplashScreen from 'react-native-splash-screen';
import withLocalStorage from '../hoc/withLocalStorage';
import ProfileScreen from '../screens/ProfileScreen';
import MessageScreen from '../screens/MessageScreen';
import useUser from '../hooks/useUser';
const RootNavigator = () => {
  const userRepository = UserRepository.getInstance();
  const Stack = createStackNavigator<RootStackParamList>();
  const [authUser, setAuth] = useState(null);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const handleAuthStateChange = async (user: any) => {
      if (user) {
        try {

          let userFromUserCollection = await userRepository.getUser(user.uid);
          setUserRole(userFromUserCollection.role);
<<<<<<< HEAD
          let concatUser = { ...user, userCollection: userFromUserCollection };
=======

          let concatUser = {...user, userCollection: userFromUserCollection};
>>>>>>> 4402655e1ac8745c13d0887c0232d53fa0cb2d7a
          await setLocalStorage('AUTH_USER', concatUser);
          setAuth(user as any);

        } catch (error) {
          console.error('Error during auth state change:', error);
        }
      } else {
        try {
          setAuth(null);
          await setLocalStorage('AUTH_USER', null);
        } catch (error) {
          console.error('Error during auth state change:', error);
        }
      }
      SplashScreen.hide();
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return () => unsubscribe();
  }, []);

  return (
    <>
      {authUser != null && <FirebaseNotifications />}
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {authUser === null ? (
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="StudentsScreen"
              component={StudentsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddStudentScreen"
              component={AddStudentScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CalendarScreen"
              component={CalendarScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="StudentDetailScreen"
              component={StudentDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UpdateStudentScreen"
              component={UpdateStudentScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ClassRoomScreen"
              component={ClassRoomScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddClassScreen"
              component={AddClassScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UpdateClassScreen"
              component={UpdateClassScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="StudentEvulationScreen"
              component={StudentEvulationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddStudentEvulationScreen"
              component={AddStudentEvulationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UpdateStudentEvulationScreen"
              component={UpdateStudentEvulationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddAbsenceScreen"
              component={AddAbsenceScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MessageScreen"
              component={MessageScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default withLocalStorage(RootNavigator, 'AUTH_USER');
