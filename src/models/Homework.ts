import HomeWorkClassRoom from './HomeWorkClassRoom';

export type HomeWorkType = 'Quiz' | 'Test' | 'Project' | 'Other';
interface Homework {
  id: string;
  homeworkTitle: string;
  description: string;
  teacherId: string;
  classRoom: HomeWorkClassRoom[];
  startDate: string;
  endDate: string;
  homeWorkType: HomeWorkType;
  createdAt: string;
  photos: string[];
}

export default Homework;
