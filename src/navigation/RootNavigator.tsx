import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  LoginScreen: undefined;
};
const RootNavigator = () => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
