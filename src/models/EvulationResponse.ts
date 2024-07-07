import EvulationQuestionResponse from './EvulationQuestionResponse';

interface EvulationResponse {
  id?: string;
  studentId: string;
  date: string;
  evulationQuestions: EvulationQuestionResponse[];
}
export default EvulationResponse;
