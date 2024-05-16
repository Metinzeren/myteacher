import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ModalPortal} from 'react-native-modals';
import KeyboardManager from 'react-native-keyboard-manager';
import './src/lang/i18n';
LogBox.ignoreAllLogs();
const MyTeacher = () => {
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(false);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setLayoutIfNeededOnUpdate(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText('Done');
    KeyboardManager.setToolbarManageBehaviourBy('subviews');
    KeyboardManager.setToolbarPreviousNextButtonEnable(false);
    KeyboardManager.setToolbarTintColor('#0000FF');
    KeyboardManager.setToolbarBarTintColor('#FFFFFF');
    KeyboardManager.setShouldShowToolbarPlaceholder(true);
    KeyboardManager.setOverrideKeyboardAppearance(false);
    KeyboardManager.setKeyboardAppearance('default');
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.setShouldPlayInputClicks(true);
    KeyboardManager.resignFirstResponder();
    KeyboardManager.isKeyboardShowing().then(isShowing => {});
  }
  return (
    <NavigationContainer>
      <RootNavigator />
      <ModalPortal />
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MyTeacher);
