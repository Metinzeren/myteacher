import AnswerType from './AnswerType';
import QuestionType from './QuestionType';

interface Questions {
  id?: string;
  name: string;
  questionType?: QuestionType;
  answer: string[];
  answerType?: AnswerType;
  teacherId: string;
}

export default Questions;
