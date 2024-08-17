// HomeworkContext.tsx

import React, {createContext, useContext, useMemo, useState} from 'react';
import Homework, {HomeWorkType} from '../models/Homework';
import HomeWorkClassRoom from '../models/HomeWorkClassRoom';
import dayjs from 'dayjs';

type BottomSheetType = 'saveStep' | 'classRoomList' | 'studentList';
interface HomeworkContextProps {
  bottomSheetType: BottomSheetType;
  setBottomSheetType: (type: BottomSheetType) => void;
  homework: Homework;
  handleChangeHomeWork: (key: keyof Homework, value: string) => void;
}

const initialState: HomeworkContextProps = {
  bottomSheetType: 'saveStep',
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
};

const HomeworkContext = createContext<HomeworkContextProps>(initialState);

interface HomeworkProviderProps {
  children: React.ReactNode;
}

const HomeworkProvider = ({children}: HomeworkProviderProps) => {
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(
    initialState.bottomSheetType,
  );
  const [homework, setHomework] = useState<Homework>(initialState.homework);
  const handleChangeHomeWork = (key: keyof Homework, value: string) => {
    setHomework(prev => ({...prev, [key]: value}));
  };
  const value = useMemo(() => {
    return {
      homework,
      bottomSheetType,
      setBottomSheetType,
      handleChangeHomeWork,
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
