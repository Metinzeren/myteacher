import Absenteeism from "./Absenteeism";

interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  studentNo: number | string;
  parentFirstName: string;
  parentLastName: string;
  newStudentId?: string;
  parentEmail: string;
  parentPhone: string;
  createdAt?: Date;
  photo?: string;
  absenteeism: Array<Absenteeism>
}

export default Student;
