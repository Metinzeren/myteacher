import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import FirebaseCollections from "../firebase/FirebaseCollections";
import Student from "../models/Student";

class StudentRepository {
    private static instance: StudentRepository;
    private studentCollection = collection(db, FirebaseCollections.STUDENTS);
    public static getInstance(): StudentRepository {
        if (!StudentRepository.instance) {
            StudentRepository.instance = new StudentRepository();
        }
        return StudentRepository.instance;
    }
    private constructor() { }
    async addStudent(student: Student) {
        const studentDoc = doc(this.studentCollection);
        student.id = studentDoc.id;
        await setDoc(studentDoc, student);
    }
}
export default StudentRepository;