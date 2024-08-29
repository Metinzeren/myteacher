
import React, { createContext, useContext, useMemo, useState } from 'react';
import Homework, { HomeWorkType } from '../models/Homework';
import HomeWorkClassRoom from '../models/HomeWorkClassRoom';
import dayjs from 'dayjs';


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
}

const initialState: HomeworkContextProps = {
  bottomSheetType: 'saveStep',
  addHomework: () => { },
  deleteHomework: () => { },
  setBottomSheetType: () => { },
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
  handleChangeHomeWork: () => { },
  setHomework: () => { },
  homeworks: [],
  setHomeworks: () => { },
  selectedHomework: null,
  setSelectedHomework: () => { },
  handleChangeSelectedHomeWork: () => { },
  updateHomework: () => { },
};

const HomeworkContext = createContext<HomeworkContextProps>(initialState);

interface HomeworkProviderProps {
  children: React.ReactNode;
}

const HomeworkProvider = ({ children }: HomeworkProviderProps) => {
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(
    initialState.bottomSheetType,
  );
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(initialState.selectedHomework);
  const [homework, setHomework] = useState<Homework>(initialState.homework);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialState.homeworks);
  const handleChangeHomeWork = (key: keyof Homework, value: string) => {
    setHomework(prev => ({ ...prev, [key]: value }));
  };

  const updateHomework = (homework: Homework) => {
    const newHomeworksArray = homeworks.map((e) => e.id === homework.id ? homework : e);
    setHomeworks(newHomeworksArray);
  }


  const handleChangeSelectedHomeWork = (key: keyof Homework, value: string) => {


    if (key === 'startDate' && dayjs(value).isAfter(selectedHomework?.endDate as string)) {
      setHomework(prev => ({
        ...prev,
        [key]: value,
        endDate: value,
      }))
    }

    setSelectedHomework(prev => ({ ...prev as Homework, [key]: value }));
  };

  const addHomework = (homework: Homework) => {
    setHomeworks([...homeworks, homework]);
  }
  const deleteHomework = (id: string) => {
    const newHomeworksArray = homeworks.filter((e) => e.id !== id);
    setHomeworks(newHomeworksArray);
  }


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
    };
  }, [bottomSheetType, handleChangeHomeWork, homework, homeworks, selectedHomework]);
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
