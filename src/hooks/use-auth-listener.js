import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";
import { getUserByUserId } from "../services/firebase";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useContext(FirebaseContext);

  const updateUserUserName = (username) => {
    console.log("update authUser username", username);
    const newUser = JSON.parse(JSON.stringify(user));
    newUser.username = username;
    console.log(newUser)
    setUser(newUser);
    // localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // we have a user...therefore we can store the user in localstorage
        firebase.auth().currentUser?.getIdTokenResult()
          .then((idTokenResult) => {
            if (!!idTokenResult.claims.admin) {
              authUser.isAdmin = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        
        const user = await getUserByUserId(authUser.uid);
        authUser.docId = user[0]?.docId;
        localStorage.setItem("authUser", JSON.stringify(authUser));
        console.log('localstorage set authUser:', authUser)
        setUser(authUser);
      } else {
        console.log('no authUser :(', authUser)
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  useEffect(() => {
    firebase.firestore().collection("users").doc(user?.docId)
      // watch for changes to the user's username
      .onSnapshot((doc) => {
        if (doc.data() && doc.data().username) {
          updateUserUserName(doc.data().username);
        }
    });
  }, [user]);

  return { user };
}
