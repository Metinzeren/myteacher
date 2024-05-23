interface Student {
    id?: string;
    firstName: string;
    lastName: string;
    parentFirstName: string;
    parentLastName: string;
    parent: "Mother" | "Father";
    parentEmail: string;
    parentPhone: string;
    createdAt?: Date;
}
export default Student;