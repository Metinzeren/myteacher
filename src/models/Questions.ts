import AnswerType from './AnswerType';
import QuestionType from './QuestionType';

interface Questions {
  id?: string;
  name: string;
  questionType?: QuestionType;
  answer: [];
  answerType?: AnswerType;
  teacherId: string;
}

export default Questions;
