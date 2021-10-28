import { useState, useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { Popover } from "react-tiny-popover"

export default function Edit({ caption }) {

  const { user } = useContext(UserContext);
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [newCaption, setNewCaption] = useState(caption);
  
  const onCaptionChange = (e) => {
    setNewCaption(e.target.value)
  }

  const updatePost = async () => {
    console.log('update post yo')
  };

  console.log(caption)

  return (
    <>
      {user?.isAdmin && (
          <Popover
            isOpen={isPopoverOpen}
            positions={['bottom']}
            onClickOutside={(e) => { if (e.target.id != 'show-edit-post-button') setIsPopoverOpen(false) }}
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