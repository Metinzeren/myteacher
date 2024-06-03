import React, { createContext, useContext, useMemo, useState } from "react";
import Student from "../models/Student";
import ClassRoom from "../models/ClassRoom";

interface ClassRoomContextProps {
    classRooms: Array<ClassRoom>;
    setClassRooms: React.Dispatch<React.SetStateAction<Array<ClassRoom>>>;
    deleteStudentFromClassRoom: (classRoomId: string, studentId: string) => void;
    addStudent: (classRoom: ClassRoom) => void;
}

const initialState: ClassRoomContextProps = {
    classRooms: [],
    setClassRooms: () => {},
    deleteStudentFromClassRoom: () => {},
    addStudent: () => {},
}

const ClassRoomContext = createContext<ClassRoomContextProps>(initialState);

interface ClassRoomProviderProps {
    children: React.ReactNode;
}

const ClassRoomProvider = ({ children }: ClassRoomProviderProps) => {
    const [classRooms, setClassRooms] = useState<Array<ClassRoom>>([]);

    const deleteStudentFromClassRoom = (classRoomId: string, studentId: string) => {
        setClassRooms(prevClassRooms => {
            return prevClassRooms.map(classRoom => {
                if (classRoom.id === classRoomId) {
                    return {
                        ...classRoom,
                        students: classRoom.students.filter(student => student.id !== studentId),
                    };
                }
                return classRoom;
            });
        });
    };

    const value = useMemo(() => ({
        classRooms,
        setClassRooms,
        deleteStudentFromClassRoom,
        addStudent: (classRoom: ClassRoom) => setClassRooms(prev => [...prev, classRoom]),
    }), [classRooms]);

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
