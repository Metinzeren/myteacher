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

class NotificationRepository {
    private static instance: NotificationRepository;
    private notificationCollection = collection(db, FirebaseCollections.NOTIFICATIONS);

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
}

export default NotificationRepository;
