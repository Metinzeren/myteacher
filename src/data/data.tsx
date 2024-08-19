import BookSvgIcon from '../assets/icons/BookSvgIcon';
import GroupSvgIcon from '../assets/icons/GroupSvgIcon';
import LogoutSvgIcon from '../assets/icons/LogoutSvgIcon';
import ScheduleSvgIcon from '../assets/icons/ScheduleSvgIcon';
import { ICONS } from '../constant/theme';

export const homeMenu = [
  {
    name: 'Sınıflar',
    icon: ICONS.HOME.class,
    link: 'ClassRoomScreen',
  },
  {
    name: 'Ödevler',
    icon: ICONS.HOME.homeworkIcon,
    link: 'CalendarScreen',
  },
  {
    name: 'Öğrenci Değerlendirme Soruları',
    icon: ICONS.HOME.evaluation,
    link: 'StudentEvulationScreen',
  },
  {
    name: 'Öğrenci Devamsızlık',
    icon: ICONS.HOME.calendar,
    link: 'AddAbsenceScreen',
  },
  {
    name: 'Çıkış Yap',
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
