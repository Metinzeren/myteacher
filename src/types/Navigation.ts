import ClassRoom from '../models/ClassRoom';
import Questions from '../models/Questions';
import Student from '../models/Student';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  HomeScreen: undefined;
  StudentsScreen: { classRoomId: string };
  AddStudentScreen: { classRoomId: string };
  CalendarScreen: undefined;
  StudentDetailScreen: { studentId: string; classRoomId: string };
  UpdateStudentScreen: {
    studentId?: string;
    classRoomId: string;
    student?: Student;
  };
  ClassRoomScreen: undefined;
  AddClassScreen: undefined;
  UpdateClassScreen: { classRoom: ClassRoom };
  NotificationScreen: undefined;
  StudentEvulationScreen: undefined;
  AddStudentEvulationScreen: undefined;
  UpdateStudentEvulationScreen: { questionId: string }
};
