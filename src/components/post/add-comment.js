import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import { toast } from "react-toastify";
import PickDisplayNamePrompt from "../pickDisplaynamePrompt";
import { updateUsername, doesUsernameExist } from "../../services/firebase";

export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
  onSubmitCallback,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const [userUsername, setUserUsername] = useState(loggedInUser?.username)
  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FirebaseContext);
  
  const [displayName, setDisplayName] = useState(userUsername || "");
  // console.log('userUsername', userUsername)
  // console.log('displayname', displayName)
  const [isDisplayNameAvailable, setIsDisplayNameAvailable] = useState();
  const [isDisplayNameValid, setIsDisplayNameValid] = useState();

  useEffect(() => {
    if (loggedInUser?.username) {
      setUserUsername(loggedInUser.username);
      console.log(loggedInUser.username)
    }
  }, [loggedInUser]);
  // DISPLAYNAME is for comment author only
  // USERNAME is stored on the user document

  const onUsernameInputChange = (e) => {
    const value = e.target.value
    if (value.length > 0) {
      let regex = /^(?=[a-zA-Z0-9._@-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      
      if (value < 3 || !value.match(regex)) {
        // invalid display name
        setIsDisplayNameValid(false)
        setDisplayName(value)
      } else {
        // valid display name
        setIsDisplayNameValid(true)
        setDisplayName(value)
        doesUsernameExist(value).then((doesExist) => {
          setIsDisplayNameAvailable(!doesExist);
        });
      }
    } else {
      // no display name
      setDisplayName("");
      setIsDisplayNameAvailable(null);
      setIsDisplayNameValid(null);
    }

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("handleSubmit", loggedInUser, event.target.value);
    if (loggedInUser?.uid) {
      if (displayName) {
        if (!userUsername) {
          // set user username if they don't have one
          updateUsername(loggedInUser.uid, displayName)
        }
        setComments([...comments, { displayName, comment }]);
        setComment("");
        onSubmitCallback({ displayName, comment });
        return firebase
          .firestore()
          .collection("photos")
          .doc(docId)
          .update({
            comments: FieldValue.arrayUnion({ displayName, comment }),
          });
      } else {
        // No username

      }
    } else {
      // No user logged in
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
    }

  };

  return (
    <div className="border rounded-lg border-gray-primary mx-auto w-11/12 md:w-full">

      {(comment.length > 0 && loggedInUser && !userUsername) && (
        <div className="px-4 py-2 bg-yellow-100 m-2 rounded-lg text-gray-500">
          <p className="text-gray-800"><strong>Before you comment, please pick a username:</strong></p>
          <div className="flex py-2">
            <input
              type="text"
              placeholder="username"
              value={displayName}
              onChange={onUsernameInputChange}
              className="border-b border-gray-400 p-2"
            />
            <div className="text-right p-2">
              {displayName.length > 0 && displayName.length < 3 && <p className="text-gray-500">It's gotta be at least 3 characters</p>}
              {displayName.length > 2 && isDisplayNameValid === false && <p className="text-red-800">Looks like something's not formatted correctly</p>}
              {(displayName?.length > 2) && isDisplayNameValid && (isDisplayNameAvailable ?
                <span className="text-gray-500"><span className="text-green-600">{displayName}</span> is available</span>
                : <span className="text-gray-500"><span className="text-red-800">{displayName}</span> isn't available :(</span>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmit(event)
            : event.preventDefault()
        }
      >

        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm rounded-lg text-gray-base w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => { console.log(userUsername); setComment(target.value)}}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium disabled:opacity-30 disabled:cursor-default `}
          type="button"
          disabled={(comment.length < 1 || (!userUsername && !isDisplayNameValid) || (!userUsername && !isDisplayNameAvailable))}
          onClick={handleSubmit}
        >
          Post
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object,
};
