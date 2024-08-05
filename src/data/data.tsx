import BookSvgIcon from '../assets/icons/BookSvgIcon';
import GroupSvgIcon from '../assets/icons/GroupSvgIcon';
import LogoutSvgIcon from '../assets/icons/LogoutSvgIcon';
import ScheduleSvgIcon from '../assets/icons/ScheduleSvgIcon';

export const homeMenu = [
  {
    name: 'Sınıflar',
    icon: <BookSvgIcon height={60} width={80} />,
    link: 'ClassRoomScreen',
  },
  {
    name: 'Ödevler',
    icon: <BookSvgIcon height={60} width={80} />,
    link: 'CalendarScreen',
  },
  {
    name: 'Öğrenci Değerlendirme Soruları',
    icon: <GroupSvgIcon height={60} width={80} />,
    link: 'StudentEvulationScreen',
  },
  {
    name: 'Öğrenci Devamsızlık',
    icon: <ScheduleSvgIcon height={60} width={80} />,
    link: 'AddAbsenceScreen',
  },
  {
    name: 'Çıkış Yap',
    icon: <LogoutSvgIcon height={60} width={80} />,
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
