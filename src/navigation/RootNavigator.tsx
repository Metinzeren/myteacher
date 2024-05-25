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
import CalendarScreen from '../screens/CalendarScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';

const RootNavigator = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  const [authUser, setAuth] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setAuth(user as any);
      } else {
        setAuth(null);
      }
    });
    return unsubscribe;
  }, []);
  return (
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
          name='CalendarScreen'
          component={CalendarScreen}
          options={{
            headerShown: false,
          }}
          />
          <Stack.Screen
          name='StudentDetailScreen'
          component={StudentDetailScreen}
          options={{
            headerShown: false,
          }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
