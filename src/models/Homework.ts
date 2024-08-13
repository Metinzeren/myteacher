interface Homework {
    id: string;
    title: string;
    description: string;
    endDate: string;
    isCompleted: boolean;
    type: string;
    teacherId: string;
    classroomId?: string[];
    studentId?: string[];
    startDate: string;
    photo: string[];
}

export default Homework;