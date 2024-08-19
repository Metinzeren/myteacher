// HomeworkContext.tsx

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
}

const initialState: HomeworkContextProps = {
  bottomSheetType: 'saveStep',
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
};

const HomeworkContext = createContext<HomeworkContextProps>(initialState);

interface HomeworkProviderProps {
  children: React.ReactNode;
}

const HomeworkProvider = ({ children }: HomeworkProviderProps) => {
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(
    initialState.bottomSheetType,
  );
  const [homework, setHomework] = useState<Homework>(initialState.homework);
  const [homeworks, setHomeworks] = useState<Homework[]>(initialState.homeworks);
  const handleChangeHomeWork = (key: keyof Homework, value: string) => {
    setHomework(prev => ({ ...prev, [key]: value }));
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
      setHomeworks
    };
  }, [bottomSheetType, handleChangeHomeWork]);
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
