import EvulationQuestions from './EvulationQuestions';

interface Evulation {
  id?: string;
  studentId: string;
  date: string;
  evulationQuestions: EvulationQuestions[];
}
export default Evulation;
