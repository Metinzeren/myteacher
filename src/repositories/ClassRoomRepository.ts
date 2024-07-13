import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import {db} from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import ClassRoom from '../models/ClassRoom';
import Student from '../models/Student';
import {getUserId} from '../utils/AsyncStorageUtils';

class ClassRoomRepository {
  private static instance: ClassRoomRepository;
  private classRoomCollection = collection(db, FirebaseCollections.CLASSROOMS);
  public static getInstance(): ClassRoomRepository {
    if (!ClassRoomRepository.instance) {
      ClassRoomRepository.instance = new ClassRoomRepository();
    }
    return ClassRoomRepository.instance;
  }

  private constructor() {}

  async addClassRoom(classRoom: ClassRoom) {
    const classRoomDoc = doc(this.classRoomCollection);
    classRoom.id = classRoomDoc.id;
    await setDoc(classRoomDoc, classRoom);
    return classRoom;
  }

  async updateClassRoom(classRoom: ClassRoom) {
    const classRoomDoc = doc(this.classRoomCollection, classRoom.id);
    await setDoc(classRoomDoc, classRoom);
    return classRoom;
  }

  async deleteClassRoom(classRoomId: string) {
    const classRoomDoc = doc(this.classRoomCollection, classRoomId);
    await deleteDoc(classRoomDoc);
  }

  async getClassRoom(classRoomId: string) {
    const classRoomDoc = doc(this.classRoomCollection, classRoomId);
    const classRoomSnapshot = await getDoc(classRoomDoc);
    return classRoomSnapshot.data() as ClassRoom;
  }

  async getAllClassRooms() {
    const classRoomSnapshot = await getDocs(this.classRoomCollection);
    const userId = await getUserId();
    let snapShots = classRoomSnapshot.docs.map(doc => doc.data() as ClassRoom);
    return snapShots.filter(classRoom => classRoom.teachers.includes(userId));
  }

  async addStudentToClassRoom(classRoomId: string, student: Student) {
    const classRoomDoc = doc(this.classRoomCollection, classRoomId);
    await updateDoc(classRoomDoc, {
      students: arrayUnion(student),
    });
    return student;
  }

  async removeStudentFromClassRoom(classRoomId: string, studentId: string) {
    const classRoomDoc = doc(this.classRoomCollection, classRoomId);
    const classRoomSnapshot = await getDoc(classRoomDoc);
    if (classRoomSnapshot.exists()) {
      const classRoom = classRoomSnapshot.data() as ClassRoom;
      const updatedStudents = classRoom.students.filter(
        student => student.id !== studentId,
      );
      await updateDoc(classRoomDoc, {
        students: updatedStudents,
      });
    }
  }

  async updateStudentInClassRoom(classRoomId: string, updatedStudent: Student) {
    const classRoomDoc = doc(this.classRoomCollection, classRoomId);
    const classRoomSnapshot = await getDoc(classRoomDoc);
    if (classRoomSnapshot.exists()) {
      const classRoom = classRoomSnapshot.data() as ClassRoom;
      const updatedStudents = classRoom.students.map(student =>
        student.id === updatedStudent.id ? updatedStudent : student,
      );
      await updateDoc(classRoomDoc, {
        students: updatedStudents,
      });
    }
  }
  async getStudentByStudentNameForQuery(name: string) {
    const querySnapshot = await getDocs(this.classRoomCollection);
    const filteredClassRooms = querySnapshot.docs
      .map(doc => doc.data() as ClassRoom)
      .filter(classRoom =>
        classRoom.students.some(
          student =>
            student.firstName.toLowerCase().includes(name.toLowerCase()) ||
            student.lastName.toLowerCase().includes(name.toLowerCase()),
        ),
      );
    return filteredClassRooms;
  }
}

export default ClassRoomRepository;
