import firestore from "@react-native-firebase/firestore";

class InitCollection {
  constructor(model, collectionName) {
    this.model = model;
    this.collectionName = collectionName;
    this.collectionRef = firestore().collection(collectionName);
  }

  async init() {
    try {
      const doc = await this.collectionRef.doc("init").get();
      if (!doc.exists) {
        await this.createCollection();
      }
      console.log(`Collection "${this.collectionName}" is initialized.`);
    } catch (error) {
      console.error("Error initializing collection:", error);
    }
  }

  async createCollection() {
    try {
      const initialData = { ...this.model, id: "init" };
      await this.collectionRef.doc("init").set(initialData);
      console.log(`Collection "${this.collectionName}" is created.`);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  }
}
