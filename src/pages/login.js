import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import InstagramLogin from 'react-instagram-login';
import axios from "axios";


export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isInvalid = emailAddress === "";

  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   try {
  //     await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
  //     history.push(ROUTES.FEED);
  //     setSuccess("")
  //   } catch (error) {
  //     setEmailAddress("");
  //     setPassword("");
  //     setError(error.message);
  //   }
  // };


  const handleSendEmail = async (event) => {
    event.preventDefault();

    var actionCodeSettings = {
      url: 'https://jakestagram.com' + ROUTES.LOGIN,
      // This must be true.
      handleCodeInApp: true
    };

    try {
      await firebase.auth().sendSignInLinkToEmail(emailAddress, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', emailAddress);
      // history.push(ROUTES.FEED);
      setError('')
      setSuccess('Check your email!\nWe sent you a magic signin link.')
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  }



  const handleSignInWithLink = async (event) => {
    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem('emailForSignIn');
      console.log('handleSignInWithLink', email, window.location.href )
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please confirm your email address.');
      }
      // The client SDK will parse the code from the link for you.
      if (email) {
        firebase.auth().signInWithEmailLink(email, window.location.href)
          .then((result) => {
            console.log('result from signInWithEmailLink', result.user, result.user ? true : false)
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            if (result.user) {
              history.push(ROUTES.FEED)
            }
          })
          .catch((error) => {
            setEmailAddress("");
            setError(error.message);
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
    }
  }

  const onSignInWithInstagramButtonClick = () => {
    // Open the Auth flow in a popup.
    window.open('/.netlify/functions/instagram-redirect', 'Sign In With Instagram', 'height=315,width=800');
  };

  // const fetchData = async() => {
  //   const results = await axios.get('/.netlify/functions/auth')
  //   console.log(results)
  // }

  // const fetchInstagramToken = async (code) => {
  //   const result = await axios({
  //     method: 'post',
  //     url: '/.netlify/functions/auth',
  //     data: {
  //       code: code
  //     },
  //     // withCredentials: true
  //   })
  //   return result
  // }

  // const fetchInstagramUsername = async (code) => {
  //   const result = await axios({
  //     method: 'get',
  //     url: 'https://graph.instagram.com/me',
  //     params: {
  //       'fields': 'id,username',
  //     },
  //     withCredentials: true
  //   })
  //   console.log('fetchInstagramToken', result)
  //   return result
  // }

  // const handleInstagramResponse = async (response) => {
  //   let result = await fetchInstagramToken(response)
  //   let username = await fetchInstagramUsername()
  //   // console.log(response)
  //   console.log(result)
  // }
 
  useEffect(() => {
    document.title = "Sign In to Jakestagram";
    handleSignInWithLink()
    // fetchData()
  }, []);
  

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      {/* <div className="flex w-3/5">
        <img
          src=""
          alt=""
        />
      </div> */}
      <div className="w-full ">
        <div className="flex flex-col w-2/5 mx-auto">
          <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
            <h1 className="flex justify-center w-full">
              <img
                src="/images/logo.svg"
                alt="Jakestagram"
                className="mt-2 w-6/12 mb-4"
              />
            </h1>

            <p className="text-center text-sm mb-2">Sign in with a magic passwordless link</p>
            {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
            {success && <p className="mb-2 text-m text-white bg-green-500 text-center rounded px-1 py-1">{success}</p>}
            <form onSubmit={handleSendEmail} method="POST">
              <input
                aria-label="Send a magic link to your email address"
                type="text"
                placeholder="Email address"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />

              <button
                disabled={isInvalid}
                type="submit"
                className={`bg-yellow-primary text-white w-full rounded h-10 font-bold ${isInvalid && "opacity-50"}`}
              >
                Send Magic Sign-in link
              </button>
              <p className="text-center my-2 text-sm text-gray-500">or</p>

              <button
                onClick={onSignInWithInstagramButtonClick}
                className={"w-full rounded h-10 font-bold bg-ig-gradient"}
              >
                <div className="bg-white rounded-sm box-border block h-9 m-0.5">
                  <div className="text-ig-gradient block leading-9">
                    Log in with Instagram
                  </div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
