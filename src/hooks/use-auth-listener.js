import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";
import { getUserByUserId } from "../services/firebase";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // we have a user...therefore we can store the user in localstorage

        // Is this user an admin?
        let isAdmin = await firebase.auth().currentUser?.getIdTokenResult()
          .then((idTokenResult) => {
            // console.log("idTokenResult", idTokenResult);
            if (!!idTokenResult.claims.admin) {
              authUser.isAdmin = true;
              // console.log("isAdmin true", authUser.isAdmin);
            }
          })
          .catch((error) => {
            console.error(error);
          });
                
        // If the user has no docId, wait for one to be assigned
        let dbUser = await getUserByUserId(authUser.uid)

        // console.log("dbUser", dbUser);
        while (!dbUser[0]?.docId) {
          console.log('while')
          dbUser = await getUserByUserId(authUser.uid)
        }
        // console.log('docid', dbUser[0].docId)

        authUser.docId = dbUser[0].docId;
        authUser.username = dbUser[0].username;
        localStorage.setItem("authUser", JSON.stringify(authUser));
        // console.log('localstorage set authUser:', authUser)
        setUser(authUser);
      } else {
        // console.log('no authUser :(', authUser)
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  let lastUsername = user?.username;
  useEffect(() => {
    // console.log('user docId', user?.docId)
    if (user?.docId) {
      firebase.firestore().collection("users").doc(user.docId)
        // watch for changes to the user's username
        .onSnapshot((doc) => {
          // console.log('user changed', doc.data())
          if (doc.data() && doc.data().username) {
            if (lastUsername !== doc.data().username) {
              lastUsername = doc.data().username
              updateUserUserName(doc.data().username);
            }
          }
        });
    }
  }, [user]);

  const updateUserUserName = (username) => {
    // console.log("update username", user, username);
    // setUser({...user, username: doc.data().username})
    const newUser = JSON.parse(JSON.stringify(user));
    newUser.username = username;
    // console.log('newUser', newUser)
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  return { user };
}
