import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const developEnvironment = process.env.NODE_ENV === "development";

const firebaseConfig = {
  apiKey: developEnvironment ? process.env.REACT_APP_developFirebaseApiKey : process.env.REACT_APP_productionFirebaseAPIKey,
  authDomain: developEnvironment ? process.env.REACT_APP_developFirebaseAuthDomain : process.env.REACT_APP_productionFirebaseAuthDomain,
  projectId: developEnvironment ? process.env.REACT_APP_developFirebaseProjectId : process.env.REACT_APP_productionFirebaseProjectId,
  storageBucket: developEnvironment ? process.env.REACT_APP_developFirebaseStorageBucket : process.env.REACT_APP_productionFirebaseStorageBucket,
  messagingSenderId: developEnvironment ? process.env.REACT_APP_developFirebaseMessagingSenderId : process.env.REACT_APP_productionFirebaseMessagingSenderId,
  appId: developEnvironment ? process.env.REACT_APP_developFirebaseAppId : process.env.REACT_APP_productionFirebaseAppId,
  measurementId: developEnvironment ? process.env.REACT_APP_developFirebaseMeasurementIdb : process.env.REACT_APP_productionFirebaseMeasurementId
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
