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
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Homework from '../models/Homework';

class HomeworkRepository {
    private static instance: HomeworkRepository;
    private homeworkCollection = collection(
        db,
        FirebaseCollections.HOMEWORKS,
    );

    public static getInstance(): HomeworkRepository {
        if (!HomeworkRepository.instance) {
            HomeworkRepository.instance = new HomeworkRepository();
        }
        return HomeworkRepository.instance;
    }

    private constructor() { }

    async addHomework(homework: Homework) {
        const homeworkDoc = doc(this.homeworkCollection);
        homework.id = homeworkDoc.id;
        await setDoc(homeworkDoc, homework);
        return homework;
    }

    async updateHomework(homework: Homework) {
        if (!homework.id) {
            throw new Error('Homework ID is required to update');
        }
        const homeworkDoc = doc(this.homeworkCollection, homework.id);
        await setDoc(homeworkDoc, homework, { merge: true });
    }

    async deleteHomework(homeworkId: string) {
        const homeworkDoc = doc(this.homeworkCollection, homeworkId);
        await deleteDoc(homeworkDoc);
    }

    async getHomework(homeworkId: string) {
        const homeworkDoc = doc(this.homeworkCollection, homeworkId);
        const homeworkSnapshot = await getDoc(homeworkDoc);
        return homeworkSnapshot.data() as Homework | undefined;
    }

    async getAllHomeworks() {
        const homeworkSnapshot = await getDocs(this.homeworkCollection);
        return homeworkSnapshot.docs.map(doc => doc.data() as Homework);
    }

    async getHomeworksByStudentId(studentId: string) {
        const homeworkQuery = query(
            this.homeworkCollection,
            where('studentId', '==', studentId)
        );
        const querySnapshot = await getDocs(homeworkQuery);

        const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
        return homeworks;
    }

    async getHomeworksByTeacherId(teacherId: string) {
        const homeworkQuery = query(
            this.homeworkCollection,
            where('teacherId', '==', teacherId)
        );
        const querySnapshot = await getDocs(homeworkQuery);

        const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
        return homeworks;
    }

    async getHomeworksByClassroomId(classroomId: string) {
        const homeworkQuery = query(
            this.homeworkCollection,
            where('classroomId', '==', classroomId)
        );
        const querySnapshot = await getDocs(homeworkQuery);

        const homeworks = querySnapshot.docs.map(doc => doc.data() as Homework);
        return homeworks;
    }
}

export default HomeworkRepository;
