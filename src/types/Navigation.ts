import Student from "../models/Student";

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  HomeScreen: undefined;
  StudentsScreen: {students:Array<Student>,classRoomId:string};
  AddStudentScreen: {classRoomId:string};
  CalendarScreen:undefined;
  StudentDetailScreen:{student:Student,classRoomId:string};
  UpdateStudentScreen:undefined; //burayı sen yaparsın boş eçiyorm
  ClassRoomScreen:undefined
};
