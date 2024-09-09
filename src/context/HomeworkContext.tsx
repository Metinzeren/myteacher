import React, {createContext, useContext, useMemo, useState} from 'react';
import Homework, {HomeWorkType} from '../models/Homework';
import HomeWorkClassRoom from '../models/HomeWorkClassRoom';
import dayjs from 'dayjs';
import ClassRoom from '../models/ClassRoom';
import Student from '../models/Student';

interface HomeWorkFilter {
  classRoom: ClassRoom;
  students: Student[];
  homeWorkType: HomeWorkType;
  startDate: string;
  endDate: string;
  isFiltered: boolean;
}

type BottomSheetType = 'saveStep' | 'classRoomList' | 'studentList';
interface HomeworkContextProps {
  bottomSheetType: BottomSheetType;
  setBottomSheetType: (type: BottomSheetType) => void;
  homework: Homework;
  handleChangeHomeWork: (key: keyof Homework, value: string) => void;
  setHomework: (homework: Homework) => void;
  homeworks: Homework[];
  setHomeworks: (homeworks: Homework[]) => void;
  addHomework: (homework: Homework) => void;
  deleteHomework: (id: string) => void;
  selectedHomework: Homework | null;
  setSelectedHomework: (homework: Homework | null) => void;
  handleChangeSelectedHomeWork: (key: keyof Homework, value: string) => void;
  updateHomework: (homework: Homework) => void;
  homeWorkFilter: HomeWorkFilter;
  handleFilter: (key: keyof HomeWorkFilter, value: any) => void;
  resetFilter(): void;
  getHomeWorks(): Homework[];
}

const initialState: HomeworkContextProps = {
  bottomSheetType: 'saveStep',
  addHomework: () => {},
  deleteHomework: () => {},
  setBottomSheetType: () => {},
  homework: {
    id: '',
    homeworkTitle: '',
    description: '',
    teacherId: '',
    classRoom: [] as HomeWorkClassRoom[],
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    homeWorkType: '' as HomeWorkType,
    createdAt: '',
    photos: [],
  },
  handleChangeHomeWork: () => {},
  setHomework: () => {},
  homeworks: [],
  setHomeworks: () => {},
  selectedHomework: null,
  setSelectedHomework: () => {},
  handleChangeSelectedHomeWork: () => {},
  updateHomework: () => {},
  handleFilter: (key: keyof HomeWorkFilter, value: any) => {},
  resetFilter: () => {},
  getHomeWorks: () => [],
  homeWorkFilter: {
    classRoom: {} as ClassRoom,
    students: [],
    homeWorkType: '' as HomeWorkType,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    isFiltered: false,
  },
};

const HomeworkContext = createContext<HomeworkContextProps>(initialState);

interface HomeworkProviderProps {
  children: React.ReactNode;
}

const HomeworkProvider = ({children}: HomeworkProviderProps) => {
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(
    initialState.bottomSheetType,
  );
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    initialState.selectedHomework,
  );
  const [homework, setHomework] = useState<Homework>(initialState.homework);
  const [homeworks, setHomeworks] = useState<Homework[]>(
    initialState.homeworks,
  );
  const [homeWorkFilter, setHomeWorkFilter] = useState<HomeWorkFilter>(
    initialState.homeWorkFilter,
  );
  const handleChangeHomeWork = (key: keyof Homework, value: string) => {
    setHomework(prev => ({...prev, [key]: value}));
  };

  const updateHomework = (homework: Homework) => {
    const newHomeworksArray = homeworks.map(e =>
      e.id === homework.id ? homework : e,
    );
    setHomeworks(newHomeworksArray);
  };

  const handleChangeSelectedHomeWork = (key: keyof Homework, value: string) => {
    if (
      key === 'startDate' &&
      dayjs(value).isAfter(selectedHomework?.endDate as string)
    ) {
      setHomework(prev => ({
        ...prev,
        [key]: value,
        endDate: value,
      }));
    }

    setSelectedHomework(prev => ({...(prev as Homework), [key]: value}));
  };

  const addHomework = (homework: Homework) => {
    setHomeworks([...homeworks, homework]);
  };
  const deleteHomework = (id: string) => {
    const newHomeworksArray = homeworks.filter(e => e.id !== id);
    setHomeworks(newHomeworksArray);
  };
  const handleFilter = (key: keyof HomeWorkFilter, value: any) => {
    if (key === 'students') {
      let temp = homeWorkFilter.students;
      console.log(value);
      let exist = temp.find(e => e.id === value.id);
      if (exist) {
        temp = temp.filter(e => e.id !== value.id);
      } else {
        temp = [...temp, value];
      }
      setHomeWorkFilter(prev => ({...prev, [key]: temp}));
    } else {
      setHomeWorkFilter(prev => ({...prev, [key]: value}));
    }
    if (
      key === 'homeWorkType' ||
      key === 'startDate' ||
      key === 'endDate' ||
      key === 'isFiltered' ||
      key === 'classRoom'
    ) {
      setHomeWorkFilter(prev => ({...prev, [key]: value}));
    }
  };
  const resetFilter = () => {
    setHomeWorkFilter(initialState.homeWorkFilter);
  };
  const getHomeWorks = () => {
    if (homeWorkFilter.isFiltered) {
      let filteredHomeworks = homeworks.filter(e => {
        console.log(e);
        let isClassRoom = e.classRoom.find(
          classRoom => classRoom.id === homeWorkFilter.classRoom.id,
        );
        console.log(isClassRoom, 'isClassRoom');
        let isStudent = e.classRoom.find(classRoom => {
          let isStudent = classRoom.students.find(st =>
            homeWorkFilter.students.find(s => s.id === st),
          );
          console.log(isStudent, 'isStudent');
          return isStudent;
        });
        let isType = e.homeWorkType === homeWorkFilter.homeWorkType;
        let isStartDate = dayjs(e.startDate).isAfter(homeWorkFilter.startDate); // tasarım yok
        let isEndDate = dayjs(e.endDate).isBefore(homeWorkFilter.endDate); // tasarım yok
        if (isClassRoom && isStudent) {
          return (isClassRoom && isStudent) || isType;
        } else {
          console.log('else');
          return isType;
        }
      });
      return filteredHomeworks;
    }
    return homeworks;
  };

  const value = useMemo(() => {
    return {
      homework,
      bottomSheetType,
      setBottomSheetType,
      handleChangeHomeWork,
      setHomework,
      addHomework,
      deleteHomework,
      homeworks,
      setHomeworks,
      setSelectedHomework,
      updateHomework,
      selectedHomework,
      handleChangeSelectedHomeWork,
      homeWorkFilter,
      handleFilter,
      resetFilter,
      getHomeWorks,
    };
  }, [
    bottomSheetType,
    handleChangeHomeWork,
    homework,
    homeworks,
    selectedHomework,
    homeWorkFilter,
    handleFilter,
    resetFilter,
  ]);
  return (
    <HomeworkContext.Provider value={value}>
      {children}
    </HomeworkContext.Provider>
  );
};

export const useHomeworks = (): HomeworkContextProps => {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error('useHomeworks must be used within a HomeworkProvider');
  }
  return context;
};

export default HomeworkProvider;
