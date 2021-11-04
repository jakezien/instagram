import { useEffect, useState, useContext } from "react";
import ImageUploading from 'react-images-uploading';
import Header from "../components/header";
import UserContext from "../context/user";
import FirebaseContext from "../context/firebase"
import * as ROUTES from "../constants/routes";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddPhoto() {
  
  const { user: loggedInUser } = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState();
  const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const onCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  const uploadImage = async () => {
    const storageRef = firebase.storage().ref();
    const newImagePath = `images/${images[0].file.name}`
    const newImageRef = storageRef.child(newImagePath);
    console.log('file to upload:', newImagePath, images?.[0])
    return newImageRef.put(images[0].file).then((snapshot) => {
      console.log('Uploaded', images[0].file.name);
      newImageRef.getDownloadURL().then(url => {
        addImageToDb(url, caption).then(() => {
          toast.success("Image posted!")
          history.push(ROUTES.FEED);
        })
      })
    }); 
  }

  const addImageToDb = async (imageUrl, caption) => {
    return firebase
      .firestore()
      .collection("photos")
      .add({
        userId: `${loggedInUser.uid}`,
        imageSrc: `${imageUrl}`,
        caption: `${caption}`,
        likes: [],
        comments: [],
        dateCreated: Date.now(),
      });
  }


  useEffect(() => {
    document.title = "Add Photo | Jakestagram";
  }, []);

    // Check to see if the logged in user is an admin
  if (loggedInUser) {
    // console.log(loggedInUser)
    firebase.auth().currentUser?.getIdTokenResult()
      .then((idTokenResult) => {
        if (!idTokenResult?.claims?.admin) {
          history.push(ROUTES.FEED);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    history.push(ROUTES.FEED);
  }
  

  return(
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <div className="flex flex-col items-center mt-32">
          <ImageUploading
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div>
                {imageList.length ? (
                  <div>
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <div className="relative">
                          <img src={image['data_url']} alt="" />
                          <button
                            onClick={() => onImageRemove(index)}
                            className="absolute top-0 right-0 m-4 bg-white text-gray-800 bg-opacity-20 py-2 pt-1 px-4 rounded-md text-4xl backdrop-filter backdrop-blur-lg"
                          >✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    style={isDragging ? { color: 'blue' } : undefined}
                    onClick={onImageUpload}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-xl"
                    {...dragProps}
                  >
                    Click or Drop here
                  </button>
                )}
              </div>
            )}
          </ImageUploading>
          <div className="mt-8 w-80">
            {/* <label className="block text-gray-500">Caption</label> */}
            <input
              type="text"
              value={caption}
              onChange={onCaptionChange}
              placeholder="Caption"
              className="border-b border-gray-400 py-2 w-full bg-transparent"
            />
          </div>
          <button
            className="bg-yellow-500 hover:bg-yellow-400 text-white disabled:opacity-30 font-bold py-2 px-4 rounded-xl mt-8 mb-24"
            disabled={!images[0]}
            onClick={uploadImage}>
            Upload image
          </button>
        </div>
      </div>
    </div>
  )
}
