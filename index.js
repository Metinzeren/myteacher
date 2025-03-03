import {AppRegistry, LogBox, Platform} from 'react-native';
import {name as appName} from './app.json';
import RootNavigator from './src/navigation/RootNavigator';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ModalPortal} from 'react-native-modals';
import KeyboardManager from 'react-native-keyboard-manager';

import StudentProvider from './src/context/StudentContext';
import ClassRoom from './src/models/ClassRoom';
import FirebaseCollections from './src/firebase/Collection/FirebaseCollections';
import InitCollection from './src/firebase/Collection/InitCollection';
import ClassRoomProvider from './src/context/ClassRoomContext';
import QuestionProvider from './src/context/StudentEvulationContext';
import Evulation from './src/models/Evulation';
import {useEffect, useState} from 'react';
import initI18n from './src/lang/i18n';
import HomeworkProvider from './src/context/HomeworkContext';
import {LocaleConfig} from 'react-native-calendars';

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
  const [isI18nReady, setI18nReady] = useState(false);
  useEffect(() => {}, []);
  useEffect(() => {
    const init = async () => {
      await initI18n();
      setI18nReady(true);
    };
    init();
  }, []);
  if (!isI18nReady) {
    return null;
  }
  const setConfigrationCalendar = () => {
    LocaleConfig.locales['tr'] = {
      monthNames: [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
      ],
      monthNamesShort: [
        'Oca',
        'Şub',
        'Mar',
        'Nis',
        'May',
        'Haz',
        'Tem',
        'Ağu',
        'Eyl',
        'Eki',
        'Kas',
        'Ara',
      ],
      dayNames: [
        'Pazar',
        'Pazartesi',
        'Salı',
        'Çarşamba',
        'Perşembe',
        'Cuma',
        'Cumartesi',
      ],
      dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
      today: 'Bugün',
    };
    LocaleConfig.defaultLocale = 'tr';
  };

  const initDb = () => {
    const initClassRoom = {
      name: 'Sınıf Adı',
      students: [],
      teachers: [],
    };
    const initEvulation = {
      date: new Date().toISOString(),
      studentId: '',
      evulationQuestions: [],
    };
    new InitCollection(initClassRoom, FirebaseCollections.CLASSROOMS);
    new InitCollection(initEvulation, FirebaseCollections.EVULATIONS);
  };
  if (process.env.NODE_ENV === 'development') {
    initDb();
  }

  return (
    <NavigationContainer>
      <ClassRoomProvider>
        <StudentProvider>
          <QuestionProvider>
            <HomeworkProvider>
              <RootNavigator />
              <ModalPortal />
            </HomeworkProvider>
          </QuestionProvider>
        </StudentProvider>
      </ClassRoomProvider>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MyTeacher);
