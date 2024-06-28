import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Questions from '../models/Questions';


class QuestionRepository {
    private static instance: QuestionRepository;
    private questionCollection = collection(db, FirebaseCollections.QUESTIONS);
    public static getInstance(): QuestionRepository {
        if (!QuestionRepository.instance) {
            QuestionRepository.instance = new QuestionRepository();
        }
        return QuestionRepository.instance;
    }
    private constructor() { }
    async addQuestion(questions: Questions) {
        const questionsDoc = doc(this.questionCollection);
        questions.id = questionsDoc.id;
        await setDoc(questionsDoc, questions);
        return questions;
    }
}

export default QuestionRepository