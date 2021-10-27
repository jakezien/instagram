import { useEffect, useState } from "react";
import ImageUploading from 'react-images-uploading';
import Header from "../components/header";


export default function AddPhoto() {
  
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  // const onChange = (imageList, addUpdateIndex) => {
  //   // data for submit
  //   console.log(imageList, addUpdateIndex);
  //   setImages(imageList);
  // };


  useEffect(() => {
    document.title = "Add Photo | Jakestagram";
  }, []);
  

  return(
    <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <h1> Upload yer stuff </h1>
        <ImageUploading>
        </ImageUploading>
      </div>
    </div>
  )
}
