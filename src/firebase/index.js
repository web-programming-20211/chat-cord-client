import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBJRfaIq-9QJMSreqGgbYErDHLbhv1naU",
  authDomain: "chat-cord-712bf.firebaseapp.com",
  projectId: "chat-cord-712bf",
  storageBucket: "chat-cord-712bf.appspot.com",
  messagingSenderId: "196707948525",
  appId: "1:196707948525:web:c2690d98f36a957b0479e4",
  measurementId: "G-WXRTH429VW"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
