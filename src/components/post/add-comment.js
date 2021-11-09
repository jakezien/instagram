import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { toast } from "react-toastify";
import { updateUsername } from "../../services/firebase";
import UsernameInput from "../usernameInput";

export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
  onSubmitCallback,
}) {

  const { firebase, FieldValue } = useContext(FirebaseContext);  
  const { user } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [username, setUsername]  = useState(user?.username || null)
  const [isUsernameValid, setIsUsernameValid]  = useState()
  const [isUsernameAvailable, setIsUsernameAvailable]  = useState()
  
  // DISPLAYNAME is stored only on the comment for author label
  // USERNAME is stored on the user document

  const onUsernameInputChange = (e) => {
    // console.log(e)
    setUsername(e.username)
    setIsUsernameValid(e.isUsernameValid)
    setIsUsernameAvailable(e.isUsernameAvailable)
  }

  useEffect(() => {
    // console.log(user)
    if (user?.username) {
      // console.log('set username', user.username)
      setUsername(user.username)
    }
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("handleSubmit", username, comment, user );
    if (user?.uid) {
      if (username?.length) {
        if (!user?.username?.length) {
          // set user username if they don't have one
          updateUsername(user.uid, username)
        }
        if (comments) {
          // console.log("comments", comments);
          setComments([...comments, { displayName:username, comment }]);
        }
        setComment("");
        onSubmitCallback({ displayName:username, comment });
        return firebase
          .firestore()
          .collection("photos")
          .doc(docId)
          .update({
            comments: FieldValue.arrayUnion({ displayName: username, comment, createdAt: firebase.firestore().Timestamp.now(), uid: user.uid }),
          }).then(() => {
            toast("Comment posted!");
          });
      } else {
        console.log('no username')
        // No username
      }
    } else {
      // No user logged in
      toast(
        <div className="text-center">
          <strong>Sign in to like and comment.</strong>
          <p>Sign in with one click — no need to make an account :)</p>
        </div>
      );
    }

  };

  return (
    <div className="border rounded-lg border-gray-primary mx-auto w-11/12 md:w-full dark:border-gray-600">

      {(comment.length > 0 && user && !user?.username) && (
        <div className="px-4 py-2 bg-yellow-100 m-2 rounded-lg text-gray-500 dark:bg-yellow-800 dark:text-gray-300">
          <p className="text-gray-800"><strong>Before you comment, please pick a username:</strong></p>
          <UsernameInput callback={onUsernameInputChange}/>
        </div>  
      )}

      <form
        className="flex justify-between px-0"
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
          className="text-sm rounded-lg text-gray-base w-full mr-3 py-5 px-4 bg-transparent dark:text-gray-300"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => {setComment(target.value)}}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold px-4 md:px-6 my-2 mr-2 rounded-md bg-yellow-400 dark:bg-yellow-500 disabled:opacity-0 disabled:cursor-default hover:bg-yellow-300 dark:hover:bg-yellow-400`}
          type="button"
          disabled={(comment.length < 1 || (!user?.username && !isUsernameValid) || (!user?.username && !isUsernameAvailable))}
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
