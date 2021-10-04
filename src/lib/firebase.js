import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDRuF0AhaCMPez3_hh1xdNB86qEgZjJ8iQ",
  authDomain: "instagram-demo-2cccf.firebaseapp.com",
  projectId: "instagram-demo-2cccf",
  storageBucket: "instagram-demo-2cccf.appspot.com",
  messagingSenderId: "391350755438",
  appId: "1:391350755438:web:b670f50294e5d4d78a067f",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
