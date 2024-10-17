interface Absenteeism {
    id?: string;
    studentId: string;
    classRoomId: string;
    startDate: string;
    endDate: string;
    description: string;
    photo?: string;
    type?: string;
    isApproved?: 'pending' | 'approved' | 'rejected';
    notes?: string;
    studentName: string;
}
export default Absenteeism;
