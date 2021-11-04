import { useState } from "react";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import AddComment from "./add-comment";

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
}) {
  const [comments, setComments] = useState(allComments || null);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showAllComments = () => {
    if (comments) {
      setCommentsSlice(comments.length+1);
    }
  };

  const onCommentSubmit = (comment) => {
    showAllComments();
  };

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments?.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <span className="mr-1 font-bold">{item.displayName}</span>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments?.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showAllComments}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                showAllComments();
              }
            }}
          >
            More comments
          </button>
        )}
        <p className="text-gray-base text-xs mt-2 dark:text-gray-500">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
        onSubmitCallback={onCommentSubmit}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired,
};
