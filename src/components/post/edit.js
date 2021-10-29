import { useState, useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { Popover } from "react-tiny-popover"

export default function Edit({ caption }) {

  const { user } = useContext(UserContext);
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
  const [newCaption, setNewCaption] = useState(caption);
  
  const onCaptionChange = (e) => {
    setNewCaption(e.target.value)
  }

  const updatePost = async () => {
    console.log('update post yo')
  };

  const deletePost = async (downloadURL) => {
    // Delete the file
    // var citiesRef = db.collection("photos");
    // var query = db.collection("photos").where("imageSrc", "==", downloadURL);
    // storage.storage.refFromURL(downloadURL).delete().then(() => {
      // File deleted successfully


    // }).catch((error) => {
      // Uh-oh, an error occurred!

    // });
  }



  return (
    <>
      {user?.isAdmin && (
          <Popover
            isOpen={isPopoverOpen}
            positions={['bottom']}
            onClickOutside={(e) => { if (e.target.id != 'show-edit-post-button' || 'show-delete-post-button') setIsPopoverOpen(false) }}
            content={
              <div className="bg-white px-4 py-4 shadow-lg rounded-md">
                <input type="text" value={newCaption} onChange={onCaptionChange}/>
                <button
                  type="button"
                  title="Edit post"
                  onClick={() => {}}
                  className="py-2 mt-2 bg-white w-full rounded-md hover:bg-yellow-200"
                  id="show-edit-post-button"
                >
                  Update post
                </button>
                {isDeletePostOpen ? (
                  <button
                    type="button"
                    title="Edit post"
                    onClick={() => setIsDeletePostOpen(false)}
                    className="py-2 mt-2 bg-white w-full rounded-md bg-red-300 text-red-900 hover:bg-red-400"
                  >
                    Delete post for real
                  </button>                  
                ) : (
                  <button
                    type="button"
                    title="Edit post"
                    onClick={() => setIsDeletePostOpen(true)}
                    className="py-2 mt-2 bg-white w-full rounded-md hover:bg-red-200"
                    id="show-delete-post-button"
                  >
                    Delete post
                  </button> 
                )}

              </div>
            }
          >
            <button
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={'h-8 px-3 rounded-md hover:bg-yellow-200'}
            >
              …
            </button>
          </Popover>
      )}
    </>
  );
}