import Student from "./Student";

interface ClassRoom {
    id?:string,
    name:string,
    students:Array<Student>,
    teachers:Array<String>
}

export default ClassRoom