import { useState, useContext } from "react";
import PropTypes from "prop-types";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import { SignInPromptContext } from "../../context/sign-in-prompt";


export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  let displayName = loggedInUser?.displayName
  let signInPromptContext = useContext(SignInPromptContext)




  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleSubmitComment = (event) => {
    event.preventDefault();
    // console.log('submit comment', displayName, comment)

    if (loggedInUser?.uid) {
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
      signInPromptContext.setShowPrompt(true)
    }

  };

  return (
    <div className="border rounded-lg border-gray-primary mx-auto w-11/12 md:w-full">
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
          className={`text-sm font-bold text-blue-medium ${
            !comment && "opacity-25"
          }`}
          type="button"
          disabled={comment.length < 1}
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
