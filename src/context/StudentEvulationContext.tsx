import { createContext, useContext, useMemo, useState } from "react";
import Questions from "../models/Questions";

interface QuestionContextProps {
    questions: Array<Questions>,
    setQuestions: React.Dispatch<React.SetStateAction<Array<Questions>>>,
    deleteQuestion: (id: string) => void,
    addQuestion: (question: Questions) => void,
    updateQuestion: (updatedQuestion: Questions) => void
}
const initialState: QuestionContextProps = {
    questions: [],
    setQuestions: () => { },
    deleteQuestion: (id) => { },
    addQuestion: (questions) => { },
    updateQuestion: (updatedQuestion) => { }
}
const QuestionsContext = createContext<QuestionContextProps>(
    initialState
)

interface QuestionProviderProps {
    children: React.ReactNode
}
const QuestionProvider = (props: QuestionProviderProps) => {
    const [questions, setQuestions] = useState<Array<Questions>>([])
    const deleteQuestion = (id: string) => {
        const newQuestionsArray = questions.filter((element) => element.id !== id);
        setQuestions(newQuestionsArray)
    }
    const addQuestion = (question: Questions) => {

        setQuestions([...questions, question]);
    }
    const updateQuestion = (updatedQuestion: Questions) => {
        const updatedQuestions = questions.map((question) => {
            if (question.id === updatedQuestion.id) {
                return updatedQuestion;
            }
            return question;
        });
        setQuestions(updatedQuestions);
    }
    const value = useMemo(() => {
        return {
            questions, setQuestions, deleteQuestion, addQuestion, updateQuestion
        }
    }, [questions])
    return (
        <QuestionsContext.Provider value={value}>
            {props.children}
        </QuestionsContext.Provider>
    )
}

export const useQuestions = (): QuestionContextProps => {
    const context = useContext(QuestionsContext);
    return context
}
export default QuestionProvider