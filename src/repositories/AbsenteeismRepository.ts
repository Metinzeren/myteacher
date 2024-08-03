import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import {db} from '../firebase/config';
import FirebaseCollections from '../firebase/Collection/FirebaseCollections';
import Absenteeism from '../models/Absenteeism';

class AbsenteeismRepository {
  private static instance: AbsenteeismRepository;
  private absenteeismCollection = collection(
    db,
    FirebaseCollections.ABSENTEEISMS,
  );

  public static getInstance(): AbsenteeismRepository {
    if (!AbsenteeismRepository.instance) {
      AbsenteeismRepository.instance = new AbsenteeismRepository();
    }
    return AbsenteeismRepository.instance;
  }

  private constructor() {}

  async addAbsenteeism(absenteeism: Absenteeism) {
    const absenteeismDoc = doc(this.absenteeismCollection);
    absenteeism.id = absenteeismDoc.id;
    await setDoc(absenteeismDoc, absenteeism);
    return absenteeism;
  }

  async updateAbsenteeism(absenteeism: Absenteeism) {
    if (!absenteeism.id) {
      throw new Error('Absenteeism ID is required to update');
    }
    const absenteeismDoc = doc(this.absenteeismCollection, absenteeism.id);
    await setDoc(absenteeismDoc, absenteeism, {merge: true});
  }

  async deleteAbsenteeism(absenteeismId: string) {
    const absenteeismDoc = doc(this.absenteeismCollection, absenteeismId);
    await deleteDoc(absenteeismDoc);
  }

  async getAbsenteeism(absenteeismId: string) {
    const absenteeismDoc = doc(this.absenteeismCollection, absenteeismId);
    const absenteeismSnapshot = await getDoc(absenteeismDoc);
    return absenteeismSnapshot.data() as Absenteeism | undefined;
  }

  async getAllAbsenteeisms() {
    const absenteeismSnapshot = await getDocs(this.absenteeismCollection);
    return absenteeismSnapshot.docs.map(doc => doc.data() as Absenteeism);
  }
}

export default AbsenteeismRepository;
