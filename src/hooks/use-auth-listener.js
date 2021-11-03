import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useContext(FirebaseContext);

  const updateUserDisplayName = (displayName) => {

    const newUser = JSON.parse(JSON.stringify(user));
    newUser.displayName = displayName;
    console.log(newUser)
    setUser(newUser);
    // localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
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
        
        console.log('authUser:', authUser)
        localStorage.setItem("authUser", JSON.stringify(authUser));
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
    firebase.firestore().collection("users").doc(user?.uid)
      .onSnapshot((doc) => {
        if (doc.data() && doc.data().displayName) {
          updateUserDisplayName(doc.data().displayName);
        }
    });
  }, []);

  return { user };
}
