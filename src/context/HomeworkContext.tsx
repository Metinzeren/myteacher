// HomeworkContext.tsx

import React, { createContext, useContext, useMemo, useState } from "react";
import Homework from "../models/Homework";
import uuid from 'react-native-uuid';
import Student from "../models/Student";
import ClassRoom from "../models/ClassRoom";

interface HomeworkContextProps {
    homeworks: Array<Homework>;
    setHomeworks: React.Dispatch<React.SetStateAction<Array<Homework>>>;
    addHomework: (homework: Homework) => void;
    deleteHomework: (id: string) => void;
    updateHomework: (updatedHomework: Homework) => void;
    registerDto: Homework;
    setRegisterDto: React.Dispatch<React.SetStateAction<Homework>>;
    handleChange: (key: keyof Homework, value: string) => void;
    bottomsheetcontenttype: string;
    selectedStudents: Array<Student>;
    students: Array<Student>;
    setStudents: React.Dispatch<React.SetStateAction<Array<Student>>>;
    setSelectedStudents: React.Dispatch<React.SetStateAction<Array<Student>>>;
    removeStudent: (studentId: string) => void;
    classRooms: Array<ClassRoom>;
    setClassRooms: React.Dispatch<React.SetStateAction<Array<ClassRoom>>>;
    removeClassRoom: (id: string) => void;
    selectedClassRooms: Array<ClassRoom>;
    setSelectedClassRooms: React.Dispatch<React.SetStateAction<Array<ClassRoom>>>;
}

const initialState: HomeworkContextProps = {
    homeworks: [],
    students: [],
    setStudents: () => { },
    setHomeworks: () => { },
    classRooms: [],
    setClassRooms: () => { },
    addHomework: () => { },
    deleteHomework: () => { },
    updateHomework: () => { },
    registerDto: {
        id: '',
        title: '',
        description: '',
        endDate: "",
        isCompleted: false,
        type: "",
        teacherId: "",
        classroomId: "",
        studentId: "",
        startDate: "",
        photo: [],
    },
    bottomsheetcontenttype: "saveStep" || "startCalendarStep" || "endCalendarStep" || "photoStep" || "typeStep" || "selectClassStep" || "selectStudentStep",
    setRegisterDto: () => { },
    handleChange: () => { },
    selectedStudents: [],
    setSelectedStudents: () => { },
    removeStudent: () => { },
    removeClassRoom: () => { },
    selectedClassRooms: [],
    setSelectedClassRooms: () => { },

}

const HomeworkContext = createContext<HomeworkContextProps>(initialState);

interface HomeworkProviderProps {
    children: React.ReactNode;
}

const HomeworkProvider = ({ children }: HomeworkProviderProps) => {
    const [homeworks, setHomeworks] = useState<Array<Homework>>([]);
    const [students, setStudents] = useState<Array<Student>>([]);
    const [bottomsheetcontenttype, setBottomSheetContentType] = useState<string>("saveStep");
    const [selectedStudents, setSelectedStudents] = useState<Array<Student>>([]);
    const [classRooms, setClassRooms] = useState<Array<ClassRoom>>([]);
    const [selectedClassRooms, setSelectedClassRooms] = useState<Array<ClassRoom>>([]);
    const [registerDto, setRegisterDto] = useState<Homework>({
        id: uuid.v4().toString(),
        title: '',
        description: '',
        endDate: "",
        isCompleted: false,
        type: "",
        teacherId: "",
        classroomId: [],
        studentId: [],
        startDate: "",
        photo: [],
    });




    const removeStudent = (studentId: string) => {

        setRegisterDto(prevState => ({
            ...prevState,
            studentId: prevState?.studentId?.filter(id => id !== studentId),
        }));
    };

    const removeClassRoom = (id: string) => {
        setRegisterDto(prevState => ({
            ...prevState,
            classroomId: prevState?.classroomId?.filter(classroomId => classroomId !== id),
        }));
    }

    const addHomework = (homework: Homework) => {
        setHomeworks([...homeworks, homework]);
    }

    const deleteHomework = (id: string) => {
        const newHomeworksArray = homeworks.filter((homework) => homework.id !== id);
        setHomeworks(newHomeworksArray);
    }

    const updateHomework = (updatedHomework: Homework) => {
        const newHomeworks = homeworks.map((homework) =>
            homework.id === updatedHomework.id ? updatedHomework : homework
        );
        setHomeworks(newHomeworks);
    }



    const handleChange = (key: keyof typeof registerDto, value: string | string[]) => {
        if (key === 'studentId') {
            setRegisterDto(prevState => ({
                ...prevState,
                studentId: Array.isArray(value) ? value : [...prevState?.studentId!, value as string],
            }));
        } else {
            setRegisterDto({
                ...registerDto,
                [key]: value,
            });
        }
    };


    const value = useMemo(() => {
        return {
            homeworks,
            setHomeworks,
            addHomework,
            deleteHomework,
            updateHomework,
            registerDto,
            setRegisterDto,
            bottomsheetcontenttype,
            setBottomSheetContentType,
            handleChange,
            selectedStudents,
            setSelectedStudents,
            removeStudent,
            setStudents,
            students,
            classRooms,
            setClassRooms,
            removeClassRoom,
            selectedClassRooms,
            setSelectedClassRooms,
        }
    }, [homeworks, registerDto, bottomsheetcontenttype, selectedStudents, students, classRooms, selectedClassRooms]);

    return (
        <HomeworkContext.Provider value={value}>
            {children}
        </HomeworkContext.Provider>
    );
}

export const useHomeworks = (): HomeworkContextProps => {
    const context = useContext(HomeworkContext);
    if (!context) {
        throw new Error('useHomeworks must be used within a HomeworkProvider');
    }
    return context;
}

export default HomeworkProvider;
