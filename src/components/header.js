import { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import useUser from "../hooks/use-user";
import { SignInPromptContext } from "../context/sign-in-prompt";
import { Popover } from "react-tiny-popover"
import UpdateProfile from "./profile/updateProfile"


export default function Header() {
  const promptContext = useContext(SignInPromptContext)
  const { user } = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const [signInPromptShowing, setSignInPromptShowing] = useState(promptContext.showPrompt)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

  let styles = "sticky h-16 mb-8 p-2 w-screen bg-white bg-opacity-90 border-b border-gray-primary backdrop-filter backdrop-blur backdrop-saturate-150 "
  useEffect(()=> {  
    styles += promptContext.showPrompt ? ' top-15' : ' top-0'
  }, [promptContext.showPrompt])

  console.log('user', user)

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
                  className="mt-2 ml-1 w-6/12 max-h-9 md:max-h-8"
                />
              </Link>
            </h1>
          </div>
          
          <div className="text-gray-700 text-center flex items-center align-items">

            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to={ROUTES.ADD_PHOTO}
                    aria-label="Add a photo"
                    className="block mr-2"
                  >
                    <div className="cursor-pointer hover:bg-yellow-200 p-2 rounded-md">
                      Add photo
                    </div>
                  </Link>
                )}
                
                <div className="flex items-center cursor-pointer">
                  <Popover
                    isOpen={isPopoverOpen}
                    positions={['bottom']} 
                    content={
                      <div className="bg-white px-4 py-4 shadow-lg rounded-md">
                        {isUpdateProfileOpen ? (

                            <UpdateProfile />
                          
                          ) : (
                            <>
                              <div className="flex flex-row">
                                <p className="mr-4 py-2">{user.displayName}</p>
                                <button
                                  id="show-edit-username-button"
                                  onClick={() => setIsUpdateProfileOpen(true)}
                                  className="text-gray-500 px-2 py-2 rounded-md hover:bg-yellow-200"
                                >
                                  Edit your username
                                </button>
                              </div>
                              <button
                                type="button"
                                title="Sign out"
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
                                className="py-2 mt-2 bg-white w-full rounded-md hover:bg-yellow-200"
                              >
                                👋 Sign out 
                              </button>
                            </>


                          )
                        }
                        
                      </div>
                    }
                    onClickOutside={(e) => { if (e.target.id != 'show-edit-username-button') setIsPopoverOpen(false) }}
                  >
                    <div
                      onClick={() => { setIsPopoverOpen(!isPopoverOpen); setIsUpdateProfileOpen(false) }}
                      className='cursor-pointer hover:bg-yellow-200 p-2 rounded-md'
                    >
                      <p>{user?.displayName}</p>
                    </div>
                  </Popover>
                </div>
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
