import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Devices from '../models/Devices';

class DevicesRepository {
    private static instance: DevicesRepository;
    private devicesCollection = collection(db, FirebaseCollections.DEVICES);

    public static getInstance(): DevicesRepository {
        if (!DevicesRepository.instance) {
            DevicesRepository.instance = new DevicesRepository();
        }
        return DevicesRepository.instance;
    }

    private constructor() { }

    async addDevice(device: Devices) {
        const deviceDoc = doc(this.devicesCollection, device.userId);
        await setDoc(deviceDoc, device);
        return device;
    }

    async getDeviceByUserId(userId: string) {
        const deviceDoc = doc(this.devicesCollection, userId);
        const deviceSnapshot = await getDoc(deviceDoc);
        return deviceSnapshot.exists() ? (deviceSnapshot.data() as Devices) : null;
    }

    async updateDevice(device: Devices) {
        const { userId, ...deviceWithoutId } = device;
        const deviceDoc = doc(this.devicesCollection, userId);
        await updateDoc(deviceDoc, deviceWithoutId);
        return device;
    }

    async deleteDeviceByUserId(userId: string) {
        const deviceDoc = doc(this.devicesCollection, userId);
        await deleteDoc(deviceDoc);
    }
}

export default DevicesRepository;
