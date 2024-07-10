interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    role: 'teacher' | 'parent'
}

export default User;