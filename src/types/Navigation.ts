import Student from "../models/Student";

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  HomeScreen: undefined;
  StudentsScreen: {classRoomId:string};
  AddStudentScreen: {classRoomId:string};
  CalendarScreen:undefined;
  StudentDetailScreen:{studentId:string,classRoomId:string};
  UpdateStudentScreen:{studentId:string,classRoomId:string};
  ClassRoomScreen:undefined;
  AddClassScreen:undefined;
};
