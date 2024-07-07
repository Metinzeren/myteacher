import {collection, doc, getDocs, setDoc} from 'firebase/firestore';
import {db} from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Evulation from '../models/Evulation';
import QuestionRepository from './QuestionRepository';
import EvulationQuestionResponse from '../models/EvulationQuestionResponse';
import EvulationResponse from '../models/EvulationResponse';

class EvulationRepository {
  private static instance: EvulationRepository;
  private evulationCollection = collection(db, FirebaseCollections.EVULATIONS);
  private questionRepo = QuestionRepository.getInstance();
  public static getInstance(): EvulationRepository {
    if (!EvulationRepository.instance) {
      EvulationRepository.instance = new EvulationRepository();
    }
    return EvulationRepository.instance;
  }
  private constructor() {}

  async addEvulation(evulation: Evulation) {
    const evulationDoc = doc(this.evulationCollection);
    evulation.id = evulationDoc.id;
    await setDoc(evulationDoc, evulation);
    return evulation;
  }
  async getEvulations(studentId: string) {
    const questionSnapshot = await getDocs(this.evulationCollection);
    let snapShots = questionSnapshot.docs.map(doc => doc.data() as Evulation);
    return snapShots.filter(
      (evulation: Evulation) => evulation.studentId === studentId,
    );
  }
  async getEvulationWithQuestions(
    studentId: string,
  ): Promise<EvulationResponse[]> {
    const evulations = await this.getEvulations(studentId);
    let evulationWithQuestions = await Promise.all(
      evulations.map(async evulation => {
        let evulationQuestions = await Promise.all(
          evulation.evulationQuestions.map(async evulationQuestion => {
            let question = await this.questionRepo.getQuestion(
              evulationQuestion.questionId,
            );
            return {
              ...evulationQuestion,
              question,
            } as EvulationQuestionResponse;
          }),
        );
        return {
          ...evulation,
          evulationQuestions,
        } as EvulationResponse;
      }),
    );
    return evulationWithQuestions as EvulationResponse[];
  }
}
export default EvulationRepository;
