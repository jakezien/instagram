import { useEffect, useState, useContext } from "react";
import ImageUploading from 'react-images-uploading';
import Header from "../components/header";
import UserContext from "../context/user";
import FirebaseContext from "../context/firebase"
import * as ROUTES from "../constants/routes";
import { Link, useHistory } from "react-router-dom";


export default function AddPhoto() {
  
  const { user: loggedInUser } = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const uploadImage = () => {
    const storageRef = firebase.storage().ref();
    const newImagePath = `images/${images[0].file.name}`
    const newImageRef = storageRef.child(newImagePath);
    console.log('file to upload:', newImagePath, images?.[0])
    newImageRef.put(images[0].file).then((snapshot) => {
      console.log('Uploaded', images[0].file.name);
      newImageRef.getDownloadURL().then(url => {
        console.log('url', url)
        addImageToDb(url)
      })
    });
  }

  const addImageToDb = (imageUrl) => {
    firebase
      .firestore()
      .collection("photos")
      .add({
        userId: `${loggedInUser.uid}`,
        imageSrc: `${imageUrl}`,
        caption: "",
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
            <div className="">
              <button
                style={isDragging ? { color: 'blue' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              <div>
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image['data_url']} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageRemove(index)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <button onClick={uploadImage}>
                  Upload image
                </button>
              </div>
            </div>

          )}
        </ImageUploading>
      </div>
    </div>
  )
}
