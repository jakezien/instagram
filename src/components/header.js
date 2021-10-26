import { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import useUser from "../hooks/use-user";
import { SignInPromptContext } from "../context/sign-in-prompt";



export default function Header() {
  const promptContext = useContext(SignInPromptContext)
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const [signInPromptShowing, setSignInPromptShowing] = useState(promptContext.showPrompt)
  const [isAdmin, setIsAdmin] = useState(false);

  let styles = "sticky h-16 mb-8 p-2 w-screen bg-white bg-opacity-90 border-b border-gray-primary backdrop-filter backdrop-blur backdrop-saturate-150 "
  useEffect(()=> {  
    styles = "sticky h-16 mb-8 p-2 w-screen bg-white bg-opacity-90 border-b border-gray-primary backdrop-filter backdrop-blur backdrop-saturate-150 "
    styles += promptContext.showPrompt ? ' top-15' : ' top-0'
  }, [promptContext.showPrompt])
  
  if (loggedInUser) {
    firebase.auth().currentUser?.getIdTokenResult()
      .then((idTokenResult) => {
        if (!!idTokenResult.claims.admin) {
          setIsAdmin(true)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <header className={styles + (promptContext.showPrompt ? ' top-16' : ' top-0')}>
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.FEED} aria-label="Jakestagram logo">
                <img
                  src="/images/logo.svg"
                  alt="Jakestagram"
                  className="mt-2 w-4/12 max-w-md"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center align-items">
            {isAdmin && (
              <button
                type="button"
                title="Add photo"
                onClick={() => {
                  history.push(ROUTES.ADD_PHOTO);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    history.push(ROUTES.ADD_PHOTO);
                  }
                }}
              >
                Add photo
              </button>
            )}
            
            {loggedInUser ? (
              <>
                <p className="mx-6">{loggedInUser.uid}</p>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>

                <button
                  type="button"
                  title="Sign Out"
                  onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      firebase.auth().signOut();
                      history.push(ROUTES.LOGIN);
                    }
                  }}
                >
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                
                {user && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${user?.username}`}>
                      <img
                        className="rounded-full h-8 w-8 flex"
                        src={`/images/avatars/${user?.username}.jpg`}
                        alt={`${user?.username} profile`}
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                      <p>{user?.username}</p>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-yellow-primary font-bold text-sm rounded text-black-light w-40 h-8"
                  >
                    Two-second Sign In 
                  </button>
                </Link>
                {/* <Link to={ROUTES.SIGN_IN}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
