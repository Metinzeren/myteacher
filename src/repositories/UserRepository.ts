import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import User from '../models/User';

class UserRepository {
  private static instance: UserRepository;
  private userCollection = collection(db, FirebaseCollections.USERS);

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  private constructor() { }

  async addUser(user: User) {
    const userDoc = doc(this.userCollection);
    await setDoc(userDoc, user);
    return user;
  }

  async updateUser(user: User) {
    const userDoc = doc(this.userCollection, user.id);
    await setDoc(userDoc, user);
  }

  async deleteUser(userId: string) {
    const userDoc = doc(this.userCollection, userId);
    await deleteDoc(userDoc);
  }

  async getUser(userId: string) {
    const userDoc = doc(this.userCollection, userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.data() as User;
  }

  async getAllUsers() {
    const userSnapshot = await getDocs(this.userCollection);
    return userSnapshot.docs.map(doc => doc.data() as User);
  }
}

export default UserRepository;
