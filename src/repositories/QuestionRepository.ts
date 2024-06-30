import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Questions from '../models/Questions';
import { getUserId } from '../utils/AsyncStorageUtils';

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
  async getQuestions() {
    const querySnapshot = await getDocs(this.questionCollection);
    const userId = await getUserId();
    let snapShots = querySnapshot.docs.map(doc => doc.data() as Questions)
    return snapShots.filter(question => question.teacherId.includes(userId))
  }
  async deleteQuestion(questionId: string) {
    const classRoomDoc = doc(this.questionCollection, questionId);
    await deleteDoc(classRoomDoc);
  }

  async getQuestion(questionId: string) {
    const questionDoc = doc(this.questionCollection, questionId);
    const questionSnapshot = await getDoc(questionDoc);
    return questionSnapshot.data() as Questions;
  }
  async updateQuestion(updatedQuestion: Questions) {
    const { id, ...questionWithoutId } = updatedQuestion;
    const questionDoc = doc(this.questionCollection, id);
    await updateDoc(questionDoc, questionWithoutId);
    return updatedQuestion;
  }
}

export default QuestionRepository;
