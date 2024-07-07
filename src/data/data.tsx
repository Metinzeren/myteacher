import BookSvgIcon from '../assets/icons/BookSvgIcon';
import GroupSvgIcon from '../assets/icons/GroupSvgIcon';
import ScheduleSvgIcon from '../assets/icons/ScheduleSvgIcon';

export const homeMenu = [
  {
    name: 'Sınıflar',
    icon: <BookSvgIcon height={35} width={50} />,
    link: 'ClassRoomScreen',
  },
  {
    name: 'Ödevler',
    icon: <BookSvgIcon height={35} width={50} />,
    link: 'CalendarScreen',
  },
  {
    name: 'Öğrenci Değerlendirme Soruları',
    icon: <GroupSvgIcon height={35} width={50} />,
    link: 'StudentEvulationScreen',
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
