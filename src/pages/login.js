import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { toast } from 'react-toastify';
import { createOrUpdateUser } from "../services/firebase";



export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isInvalid = emailAddress === "";

  const handleSendEmail = async (event) => {
    event.preventDefault();
    console.log(window.location.protocol + '//' + window.location.host + ROUTES.SIGN_IN_EMAIL)
    var actionCodeSettings = {
      url: window.location.protocol + '//' + window.location.host + ROUTES.SIGN_IN_EMAIL,
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
 
  useEffect(() => {
    document.title = "Sign In to Jakestagram";
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
        <div className="flex flex-col w-4/5 md:w-2/5 mx-auto">
          <div className="flex flex-col items-center bg-white p-4 py-6 border border-gray-primary mb-4 rounded">
            <h1 className="flex justify-center w-full min-h-12 max-h-16">
              <img
                src="/images/logo.svg"
                alt="Jakestagram"
                className="mt-2 w-6/12 mb-4"
              />
            </h1>

            <p className="text-center text-sm mb-3">Sign in with a magic passwordless link</p>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
