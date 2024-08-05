import React, { createContext, useContext, useMemo, useState } from "react";
import Student from "../models/Student";
import ClassRoom from "../models/ClassRoom";

interface ClassRoomContextProps {
    classRooms: Array<ClassRoom>;
    setClassRooms: React.Dispatch<React.SetStateAction<Array<ClassRoom>>>;
    deleteStudentFromClassRoom: (classRoomId: string, studentId: string) => void;
    addStudentFromClassRoom: (classRoomId: string, student: Student) => void;
    updateStudentInClassRoom: (classRoomId: string, student: Student) => void;
    addClassRoom: (classRoom: ClassRoom) => void;
    deleteClassRoom: (id: string) => void;
    updateClassRoom: (updatedClassRoom: ClassRoom) => void;
}

const initialState: ClassRoomContextProps = {
    classRooms: [],
    setClassRooms: () => { },
    deleteStudentFromClassRoom: (classRoomId: string, studentId: string) => { },
    addStudentFromClassRoom: () => { },
    updateStudentInClassRoom: () => { },
    addClassRoom: (classRoom) => { },
    deleteClassRoom: (id) => { },
    updateClassRoom: (updatedClassRoom) => { },
}

const ClassRoomContext = createContext<ClassRoomContextProps>(initialState);

interface ClassRoomProviderProps {
    children: React.ReactNode;
}

const ClassRoomProvider = ({ children }: ClassRoomProviderProps) => {
    const [classRooms, setClassRooms] = useState<Array<ClassRoom>>([]);

    const addClassRoom = (classRoom: ClassRoom) => {
        setClassRooms([...classRooms, classRoom]);
    }

    const deleteClassRoom = (id: string) => {
        const newClassRoomsArray = classRooms.filter((element) => element.id !== id);
        setClassRooms(newClassRoomsArray);
    }

    const deleteStudentFromClassRoom = (classRoomId: string, studentId: string) => {
        const newClassRooms = classRooms.map((classRoom) => {
            if (classRoom.id === classRoomId) {
                const newStudents = classRoom.students.filter((student) => student.id !== studentId);
                return { ...classRoom, students: newStudents };
            }
            return classRoom;
        });
        setClassRooms(newClassRooms);
    }

    const addStudentFromClassRoom = (classRoomId: string, student: Student) => {
        const newClassRooms = classRooms.map((classRoom) => {
            if (classRoom.id === classRoomId) {
                return { ...classRoom, students: [...classRoom.students, student] };
            }
            return classRoom;
        });
        setClassRooms(newClassRooms);
    }

    const updateStudentInClassRoom = (classRoomId: string, updatedStudent: Student) => {
        const newClassRooms = classRooms.map((classRoom) => {
            if (classRoom.id === classRoomId) {
                const newStudents = classRoom.students.map((student) =>
                    student.id === updatedStudent.id ? updatedStudent : student
                );
                return { ...classRoom, students: newStudents };
            }
            return classRoom;
        });
        setClassRooms(newClassRooms);
    }

    const updateClassRoom = (updatedClassRoom: ClassRoom) => {
        const newClassRooms = classRooms.map((classRoom) =>
            classRoom.id === updatedClassRoom.id ? updatedClassRoom : classRoom
        );
        setClassRooms(newClassRooms);
    }

    const value = useMemo(() => {
        return {
            classRooms,
            setClassRooms,
            deleteStudentFromClassRoom,
            addStudentFromClassRoom,
            updateStudentInClassRoom,
            addClassRoom,
            deleteClassRoom,
            updateClassRoom,
        }
    }, [classRooms])

    return (
        <ClassRoomContext.Provider value={value}>
            {children}
        </ClassRoomContext.Provider>
    );
}

export const useClassRooms = (): ClassRoomContextProps => {
    const context = useContext(ClassRoomContext);
    if (!context) {
        throw new Error('useClassRooms must be used within a ClassRoomProvider');
    }
    return context;
}

export default ClassRoomProvider;
