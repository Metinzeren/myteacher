import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import {db} from '../firebase/config';
import FirebaseCollections from '../firebase/FirebaseCollections';
import Student from '../models/Student';

class StudentRepository {
  private static instance: StudentRepository;
  private studentCollection = collection(db, FirebaseCollections.STUDENTS);
  public static getInstance(): StudentRepository {
    if (!StudentRepository.instance) {
      StudentRepository.instance = new StudentRepository();
    }
    return StudentRepository.instance;
  }
  private constructor() {}

  async addStudent(student: Student) {
    const studentDoc = doc(this.studentCollection);
    student.id = studentDoc.id;
    await setDoc(studentDoc, student);
  }
  async updateStudent(student: Student) {
    const studentDoc = doc(this.studentCollection, student.id);
    await setDoc(studentDoc, student);
  }
  async deleteStudent(studentId: string) {
    const studentDoc = doc(this.studentCollection, studentId);
    await deleteDoc(studentDoc);
  }
  async getStudent(studentId: string) {
    const studentDoc = doc(this.studentCollection, studentId);
    const studentSnapshot = await getDoc(studentDoc);
    return studentSnapshot.data() as Student;
  }
  async getAllStudents() {
    const studentSnapshot = await getDocs(this.studentCollection);
    return studentSnapshot.docs.map(doc => doc.data() as Student);
  }
}
export default StudentRepository;
