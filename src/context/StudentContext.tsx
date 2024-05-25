import { createContext, useContext, useMemo, useState } from "react";
import Student from "../models/Student";

interface StudentContextProps {
    students: Array<Student>,
    setStudents:React.Dispatch<React.SetStateAction<Array<Student>>>,
    deleteStudent:(id:string)=>void,
    addStudent:(student:Student)=>void
}
const initialState: StudentContextProps = {
    students: [],
    setStudents: ()=> {},
    deleteStudent:(id)=>{},
    addStudent:(student)=>{},
}
const StudentContext = createContext<StudentContextProps>(
    initialState
)

interface StudentProviderProps {
    children: React.ReactNode
}
const StudentProvider = (props: StudentProviderProps) => {
    const [students, setStudents] = useState<Array<Student>>([])
    const deleteStudent=(id:string)=>{
      const newStudentsArray = students.filter((element)=>element.id !== id);
      setStudents(newStudentsArray)
    }
    const addStudent =(student:Student)=>{

        setStudents([...students,student]);
    }
    const value = useMemo(() => {
        return {
            students, setStudents,deleteStudent,addStudent
        }
    }, [students])
    return (
        <StudentContext.Provider value={value}>
            {props.children}
        </StudentContext.Provider>
    )
}

export const useStudents = (): StudentContextProps => {
    const context = useContext(StudentContext);
    return context
}
export default StudentProvider