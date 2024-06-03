import { collection, getDocs, addDoc,doc,setDoc } from '@firebase/firestore';
import { db } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

 
class InitCollection {
  private model: any;
  private collectionName: string;
  private collectionRef: any;

  constructor(model: any, collectionName: string) {
    this.model = model;
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
    this.init();
  }

  public async init(): Promise<void> {
    try {
      
      const collectionExists = await this.getCollectionExistenceFromStorage();
      if (!collectionExists) {
        const exists = await this.checkCollectionExists();
        if (!exists) {
          await this.createCollection();
          console.log(`Collection "${this.collectionName}" is initialized.`);
        } else {
          console.log(`Collection "${this.collectionName}" already exists.`);
        }
        await this.saveCollectionExistenceToStorage(true);
      } else {
        console.log(`Collection "${this.collectionName}" already exists (checked from local storage).`);
      }
    } catch (error) {
      console.error('Error initializing collection:', error);
    }
  }

  private async checkCollectionExists(): Promise<boolean> {
    try {
      const snapshot = await getDocs(this.collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking collection existence:', error);
      return false;
    }
  }

  private async createCollection(): Promise<void> {
    try {
      const getDoc = doc(this.collectionRef);
      this.model.id = getDoc.id;
      await setDoc(getDoc,this.model);
      console.log(`Document added to collection "${this.collectionName}".`);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  }

  private async getCollectionExistenceFromStorage(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(`collection_${this.collectionName}_exists`);
      return value === 'true';
    } catch (error) {
      console.error('Error getting collection existence from storage:', error);
      return false;
    }
  }

  private async saveCollectionExistenceToStorage(exists: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(`collection_${this.collectionName}_exists`, exists.toString());
    } catch (error) {
      console.error('Error saving collection existence to storage:', error);
    }
  }
}
export default InitCollection;