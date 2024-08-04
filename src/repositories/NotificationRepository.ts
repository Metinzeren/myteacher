import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import { getUserId } from '../utils/AsyncStorageUtils';
import NotificationModel from '../models/NotificationModel';
import NotificationResponse from '../models/NotificationResponse';
import ClassRoomRepository from './ClassRoomRepository';

class NotificationRepository {
    private static instance: NotificationRepository;
    private notificationCollection = collection(db, FirebaseCollections.NOTIFICATIONS);
    private ClassRepo = ClassRoomRepository.getInstance();
    public static getInstance(): NotificationRepository {
        if (!NotificationRepository.instance) {
            NotificationRepository.instance = new NotificationRepository();
        }
        return NotificationRepository.instance;
    }

    private constructor() { }





    async deleteNotification(notificationId: string) {
        const notificationDoc = doc(this.notificationCollection, notificationId);
        await deleteDoc(notificationDoc);
    }

    async getNotification(notificationId: string) {
        const notificationDoc = doc(this.notificationCollection, notificationId);
        const notificationSnapshot = await getDoc(notificationDoc);
        return notificationSnapshot.data() as NotificationModel;
    }

    async getNotificationsByUserId(userId: string) {
        const notificationsQuery = query(
            this.notificationCollection,
            where('to', '==', userId)
        );
        const querySnapshot = await getDocs(notificationsQuery);

        return querySnapshot.docs.map(doc => doc.data() as NotificationModel);
    }

    async getAllNotifications() {
        const notificationSnapshot = await getDocs(this.notificationCollection);
        return notificationSnapshot.docs.map(doc => doc.data() as NotificationModel);
    }

    async getNotificationWithStudents(userId: string): Promise<NotificationResponse[]> {
        const notifications = await this.getNotificationsByUserId(userId);
        return await Promise.all(
            notifications.map(async notification => {
                const classRooms = await this.ClassRepo.getClassRoom(notification.data.classRoomId);
                const student = classRooms.students.find(student => student.newStudentId === notification.data.studentId);
                return {
                    ...notification,
                    student
                } as NotificationResponse;
            })
        );


    }

}

export default NotificationRepository;
