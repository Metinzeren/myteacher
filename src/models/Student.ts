interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  studentNo: number;
  parentFirstName: string;
  parentLastName: string;
  parent: 'Mother' | 'Father';
  parentEmail: string;
  parentPhone: string;
  createdAt?: Date;
  photo?:string;
}
export default Student;
