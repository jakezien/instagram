import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import {seedDatabase } from '../seed'

const config = {
  apiKey: 'AIzaSyDMDu7KAZ-cQwHEJxq9DSkL9D18o8UnZPM',
  authDomain: 'jakestagram-a3852.firebaseapp.com',
  projectId: 'jakestagram-a3852',
  storageBucket: 'jakestagram-a3852.appspot.com',
  messagingSenderId: '10127617103',
  appId: '1:10127617103:web:8e8d7c265e1e4ec0108e3a'
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// seedDatabase(firebase);

export { firebase, FieldValue };
