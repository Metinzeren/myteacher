import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db} from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Homework from '../models/Homework';
import {
  getLocalStorage,
  getUserFromCollection,
} from '../utils/AsyncStorageUtils';

class HomeworkRepository {
  private static instance: HomeworkRepository;
  private homeworkCollection = collection(db, FirebaseCollections.HOMEWORKS);

  public static getInstance(): HomeworkRepository {
    if (!HomeworkRepository.instance) {
      HomeworkRepository.instance = new HomeworkRepository();
    }
    return HomeworkRepository.instance;
  }

  private constructor() {}

  async updateHomework(homework: Homework) {
    console.log(homework);
    const homeworkDoc = doc(this.homeworkCollection, homework.id);
    await setDoc(homeworkDoc, homework, {merge: true});
  }

  async deleteHomework(homeworkId: string) {
    console.log(homeworkId);

    const homeworkDoc = doc(this.homeworkCollection, homeworkId);
    await deleteDoc(homeworkDoc);
  }

  async getHomework(homeworkId: string) {
    const homeworkDoc = doc(this.homeworkCollection, homeworkId);
    const homeworkSnapshot = await getDoc(homeworkDoc);
    return homeworkSnapshot.data() as Homework | undefined;
  }

  async getAllHomeworks() {
    const user = await getLocalStorage('AUTH_USER');
    let {role: userRole, studentId} = user.userCollection;

    let userId = user.uid;
    if (userRole === 'teacher') {
      const homeworkQuery = query(
        this.homeworkCollection,
        where('teacherId', '==', userId),
      );
      const querySnapshot = await getDocs(homeworkQuery);
      return querySnapshot.docs.map(doc => doc.data() as Homework);
    } else {
      const querySnapshot = await getDocs(this.homeworkCollection);
      const filteredHomework = querySnapshot.docs
        .map(doc => doc.data() as Homework)
        .filter(homework =>
          homework.classRoom.some(classRoomObj =>
            classRoomObj.students.includes(studentId),
          ),
        );
      return filteredHomework;
    }
  }

  async getHomeworksByStudentId(studentId: string) {
    const homeworkQuery = query(
      this.homeworkCollection,
      where('studentId', '==', studentId),
    );
    const querySnapshot = await getDocs(homeworkQuery);

    const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
    return homeworks;
  }

  async getHomeworksByTeacherId(teacherId: string) {
    const homeworkQuery = query(
      this.homeworkCollection,
      where('teacherId', '==', teacherId),
    );
    const querySnapshot = await getDocs(homeworkQuery);

    const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
    return homeworks;
  }

  async getHomeworksByClassroomId(classroomId: string) {
    const homeworkQuery = query(
      this.homeworkCollection,
      where('classroomId', '==', classroomId),
    );
    const querySnapshot = await getDocs(homeworkQuery);

    const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
    return homeworks;
  }
}

export default HomeworkRepository;
