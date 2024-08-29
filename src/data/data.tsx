import { ICONS } from '../constant/theme';


export const homeMenu = [
  {
    name: 'CLASSROOM',
    icon: ICONS.HOME.class,
    link: 'ClassRoomScreen',
  },
  {
    name: 'HOMEWORKS',
    icon: ICONS.HOME.homeworkIcon,
    link: 'CalendarScreen',
  },
  {
    name: 'QUESTIONS',
    icon: ICONS.HOME.evaluation,
    link: 'StudentEvulationScreen',
  },
  {
    name: 'ABSENCE',
    icon: ICONS.HOME.calendar,
    link: 'AddAbsenceScreen',
  },
  {
    name: 'LOGOUT',
    icon: ICONS.HOME.exit,
    link: '',
  },
];

export const homeWidget = [
  {
    title: 'Öğrenci sayısı',
    count: '51',
  },
  {
    title: 'Sınıf sayısı',
    count: '42',
  },
  {
    title: 'Veli sayısı',
    count: '31',
  },
  {
    title: 'Veli sayısı',
    count: '31',
  },
];
export const Flags = [
  {
    languageName: 'Türkçe',
    languageCode: 'tr',
    languageIcon: require('../assets/flags/turkey.png'),
  },
  {
    languageName: 'English',
    languageCode: 'en',
    languageIcon: require('../assets/flags/usa.png'),
  },
];
