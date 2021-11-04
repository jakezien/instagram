import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { toast } from 'react-toastify';
import { createOrUpdateUser } from "../services/firebase";

export default function SignInEmail() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isInvalid = emailAddress === "";

  const handleSignInWithLink = async (event) => {
    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please confirm your email address:');
      }
      // The client SDK will parse the code from the link for you.
      if (email) {
        firebase.auth().signInWithEmailLink(email, window.location.href)
          .then((result) => {
            console.log('result from signInWithEmailLink', result.user)
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            if (result.user) {
              history.push(ROUTES.FEED)
              if (result.additionalUserInfo.isNewUser) {
                console.log('creating user', result.user.uid, email)
                createOrUpdateUser(result.user.uid, email)
                toast(
                  <div className="text-center">
                    <p><strong>You're signed in</strong></p>
                    <p>Welcome to Jakestagram!</p>
                  </div>
                )
              } else {
                toast(`Alright, you're signed in!`)
              }
            }
          })
          .catch((error) => {
            setEmailAddress("");
            setError(error.message);
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
    } else {
      history.push(ROUTES.FEED)
    }
  }

  useEffect(() => {
    document.title = "Signing in to Jakestagram…";
    handleSignInWithLink()
  }, []);
  

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="w-full ">
        <div className="flex flex-col w-4/5 md:w-2/5 mx-auto">
          <div className="flex flex-col items-center bg-white p-4 py-6 border border-gray-primary mb-4 rounded">
            <h1 className="flex justify-center w-full min-h-12 max-h-16">
              <img
                src="/images/logo.svg"
                alt="Jakestagram"
                className="mt-2 w-6/12 mb-4"
              />
            </h1>

            <p className="text-center text-lg mb-2">Signing you in, one sec…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
