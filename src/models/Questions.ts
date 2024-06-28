interface Questions {
    id?: string;
    name: string;
    questionType?: "rating" | "option" | "text";
    answer: [];
    answerType?: "single" | "multiple";
    teacherId: string;
}

export default Questions;