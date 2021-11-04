import { useState, useContext } from "react";
import PropTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { SignInPromptContext } from "../../context/sign-in-prompt";
import { toast } from 'react-toastify';

export default function Actions({
  content,
  totalLikes,
  likedPhoto,
  handleFocus,
}) {

  const { user: loggedInUser } = useContext(UserContext);
  const signInPromptContext = useContext(SignInPromptContext)

  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleToggleLiked = async () => {

    if (loggedInUser?.uid) {
      setToggleLiked((toggleLiked) => !toggleLiked);
      console.log(content)
      await firebase
        .firestore()
        .collection("photos")
        .doc(content.docId)
        .update({
          likes: toggleLiked
            ? FieldValue.arrayRemove(loggedInUser.uid)
            : FieldValue.arrayUnion(loggedInUser.uid),
        });
        
      setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
    } else {
      toast(<div className="text-center">
        <strong>Sign in to like and comment.</strong>
        <p>Sign in with one click — no need to make an account :)</p>
      </div>, {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // signInPromptContext.setShowPrompt(true)
    }
  };

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex h-10">
          {/* <svg
            onClick={handleToggleLiked}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleToggleLiked();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill={toggleLiked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked ? "fill-red-500 text-red-600" : "text-black-light"
            } dark:text-gray-300`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg> */}
          <div className={`px-2 py-1 ${toggleLiked && 'bg-yellow-500'} text-center rounded-lg mr-4`}>
            <svg
              viewBox="0 0 44 24" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{
                fillRule: 'evenodd',
                clipRule: 'evenodd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 1.5
              }}
              onClick={handleToggleLiked}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleToggleLiked();
                }
              }}
              stroke="currentColor"
              tabIndex={0}
              className={`w-14 h-8 p-0 m-0 select-none cursor-pointer focus:outline-none ${
                toggleLiked ? "bg-yellow-500 text-white" : "text-black-light"
              } dark:text-gray-300`}
            >
              <g><g>
                <path d="M17.767,3.23l7.506,4.333l0,8.668l-7.506,4.333l-7.506,-4.333l0,-8.668l7.506,-4.333Z" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M21.629,14.304l0,-4.814" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M13.599,9.73l4.168,-2.406" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M13.817,14.304l4.168,2.406" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M10.261,16.231l-4.558,2.675" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M10.261,7.563l-4.558,-2.675" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <path d="M25.273,16.231l0,-8.668l7.506,-4.333l7.506,4.333l0,6.423" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <circle cx="40.285" cy="16.231" r="2.245" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <circle cx="3.765" cy="20.04" r="2.245" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }}/>
                <circle cx="3.765" cy="3.754" r="2.245" style={{
                  fill:'none',
                  strokeWidth:'2.25px'
                }} />
              </g></g>
            </svg>
          </div>
          <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleFocus();
              }
            }}
            className="w-8 text-black-light select-none cursor-pointer focus:outline-none dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </>
  );
}
