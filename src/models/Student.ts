import Absenteeism from "./Absenteeism";

interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  studentNo: number | string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  createdAt?: Date;
  photo?: string;
  parentId?: string;
  absenteeism: Array<Absenteeism>
}

export default Student;
