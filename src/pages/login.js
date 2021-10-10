import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";

export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isInvalid = emailAddress === "";

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTES.FEED);
      setSuccess("")
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();

    var actionCodeSettings = {
      url: 'http://localhost:3000' + ROUTES.LOGIN,
      // This must be true.
      handleCodeInApp: true
    };

    try {
      await firebase.auth().sendSignInLinkToEmail(emailAddress, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', emailAddress);
      // history.push(ROUTES.FEED);
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

  useEffect(() => {
    document.title = "Login - Instagram";
    handleSignInWithLink()
  }, []);

  

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src=""
          alt=""
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.svg"
              alt="Jakestagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
          {success && <p className="mb-4 text-xs text-green-primary">{success}</p>}
          <p className="text-center text-sm mb-2">Sign in with a magic passwordless link</p>
          <form onSubmit={handleSendEmail} method="POST">
            <input
              aria-label="Send a magic link to my email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
{/*            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />*/}
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${isInvalid && "opacity-50"}`}
            >
              Send Magic Sign-in link
            </button>
            <p className="text-center my-2">or</p>
            <button>
              Sign in with Instagram
            </button>
            <p className="text-s text-center">Yep, for real</p>
            

          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to={ROUTES.SIGN_IN} className="font-bold text-blue-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
