import { createContext, useContext, useMemo, useState } from "react";
import Questions from "../models/Questions";

interface QuestionContextProps {
    questions: Array<Questions>,
    setQuestions: React.Dispatch<React.SetStateAction<Array<Questions>>>,
    deleteQuestion: (id: string) => void,
    addQuestion: (question: Questions) => void
}
const initialState: QuestionContextProps = {
    questions: [],
    setQuestions: () => { },
    deleteQuestion: (id) => { },
    addQuestion: (questions) => { },
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
    const value = useMemo(() => {
        return {
            questions, setQuestions, deleteQuestion, addQuestion
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