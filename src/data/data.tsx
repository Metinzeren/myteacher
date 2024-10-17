import {ICONS} from '../constant/theme';

export const homeMenu = [
  {
    name: 'CLASSROOM',
    icon: ICONS.HOME.class,
    link: 'ClassRoomScreen',
    role: ['teacher'],
  },
  {
    name: 'HOMEWORKS',
    icon: ICONS.HOME.homeworkIcon,
    link: 'CalendarScreen',
    role: ['teacher', 'parent'],
  },
  {
    name: 'QUESTIONS',
    icon: ICONS.HOME.evaluation,
    link: 'StudentEvulationScreen',
    role: ['teacher'],
  },
  {
    name: 'MESSAGES',
    icon: ICONS.HOME.class,
    link: 'MessageScreen',
    role: ['teacher', 'parent'],
  },
  {
    name: 'ABSENCE',
    icon: ICONS.HOME.calendar,
    link: 'AddAbsenceScreen',
    role: ['parent'],
  },
  {
    name: 'LOGOUT',
    icon: ICONS.HOME.exit,
    link: '',
    role: ['teacher', 'parent'],
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
