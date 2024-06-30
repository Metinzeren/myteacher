import { AppRegistry, LogBox, Platform } from 'react-native';
import { name as appName } from './app.json';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { ModalPortal } from 'react-native-modals';
import KeyboardManager from 'react-native-keyboard-manager';
import './src/lang/i18n';
import StudentProvider from './src/context/StudentContext';
import ClassRoom from './src/models/ClassRoom';
import FirebaseCollections from './src/firebase/Collection/FirebaseCollections';
import InitCollection from './src/firebase/Collection/InitCollection';
import ClassRoomProvider from './src/context/ClassRoomContext';
import QuestionProvider from './src/context/StudentEvulationContext';

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
    KeyboardManager.isKeyboardShowing().then(isShowing => { });
  }

  const initDb = () => {
    const classRoomModel: ClassRoom = {
      name: 'Sınıf Adı',
      students: [],
      teachers: [],
    };
    new InitCollection(classRoomModel, FirebaseCollections.CLASSROOMS);
  };
  if (process.env.NODE_ENV === 'development') {
    initDb();
  }

  return (
    <NavigationContainer>
      <ClassRoomProvider>
        <StudentProvider>
          <QuestionProvider>
            <RootNavigator />
            <ModalPortal />
          </QuestionProvider>
        </StudentProvider>
      </ClassRoomProvider>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MyTeacher);
