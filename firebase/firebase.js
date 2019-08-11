import * as firebase from "firebase";
import "firebase/firestore";

export class FirebaseWrapper {
  constructor() {
    this.initialized = false;
    this._firebaseInstance = null; // instance of our npm package
    this._firebaseWrapperInstance = null; // instance of our wrapper
    this._firestore = null;
  }

  Initialize(config) {
    if (!this.initialized) {
      // initalize firebase
      this._firebaseInstance = firebase.initializeApp(config);
      this._firestore = firebase.firestore();
      this.initialized = true;
    } else {
      console.log("already initialized!");
    }
  }

  static GetInstance() {
    if (null == this._firebaseWrapperInstance) {
      this._firebaseWrapperInstance = new FirebaseWrapper();
    } else {
      // Aready initialized, do nothing
    }
    return this._firebaseWrapperInstance;
  }

  async CreateNewDocument(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc();

      const timestamp = firebase.firestore.Timestamp.now().toDate();
      return await ref.set({ ...doc, createdAt: timestamp, id: ref.id });
    } catch (error) {
      console.log("something went wrong creating a new document:", error);
    }
  }

  async SetupCollectionListener(collectionPath, callback) {
    try {
      console.log("calling SetupCollectionListener");
      await this._firestore
        .collection(collectionPath)
        .orderBy("createdAt", "desc")
        .onSnapshot(querySnapshot => {
          let container = [];
          querySnapshot.forEach(doc => {
            container.push(doc.data());
          });
          return callback(container);
        });
    } catch (error) {
      console.log("error collecting", error);
    }
  }
}
