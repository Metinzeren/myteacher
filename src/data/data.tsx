import BookSvgIcon from "../assets/icons/BookSvgIcon";
import GroupSvgIcon from "../assets/icons/GroupSvgIcon";
import ScheduleSvgIcon from "../assets/icons/ScheduleSvgIcon";

export const homeMenu = [
    {
      name: 'Öğrenciler',
      icon: <BookSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Ödevler',
      icon: <BookSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Ödev Takvimi',
      icon: <ScheduleSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Veliler',
      icon: <GroupSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
  ];

export const homeWidget = [
    {
        title:"Öğrenci sayısı",
        count:"51",
    },
    {
        title:"Sınıf sayısı",
        count:"42"
    },
    {
        title:"Veli sayısı",
        count:"31"
    },
]