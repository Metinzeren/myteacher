import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
LogBox.ignoreAllLogs();
const MyTeacher = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MyTeacher);
