import { useState, useContext } from "react";
import PropTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import { toast } from "react-toastify";
import PickDisplayNamePrompt from "../pickDisplaynamePrompt";


export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  let displayName = loggedInUser?.displayName
  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleSubmitComment = (event) => {
    event.preventDefault();
    // console.log('submit comment', displayName, comment)

    if (loggedInUser?.uid) {
      if (displayName) {
        setComments([...comments, { displayName, comment }]);
        setComment("");
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

  const onDisplayNameChange = (newDisplayName) => {
    console.log(newDisplayName)
  }

  console.log(displayName, !displayName)

  return (
    <div className="border rounded-lg border-gray-primary mx-auto w-11/12 md:w-full">

      {(comment.length > 0 && loggedInUser && !displayName) && (
        <PickDisplayNamePrompt comment={comment} callback={onDisplayNameChange}/>
      )}

      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
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
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium disabled:opacity-30 disabled:cursor-default `}
          type="button"
          disabled={(comment.length < 1 || !displayName)}
          onClick={handleSubmitComment}
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
