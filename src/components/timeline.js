/* eslint-disable no-nested-ternary */
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import LoggedInUserContext from "../context/logged-in-user";
import usePhotos from "../hooks/use-photos";
import useJakePhotos from "../hooks/use-jake-photos";
import Post from "./post";

export default function Timeline() {
  // const { user } = useContext(LoggedInUserContext);

  // const { user: { following } = {} } = useContext(LoggedInUserContext);

  const { photos } = useJakePhotos();
  // console.log(photos)

  return (
    <div className="container col-span-3">
      {photos === undefined || photos === null ? (
        <Skeleton count={2} width={640} height={500} className="mb-5" />
      ) : photos?.length === 0 ? (
        <p className="flex justify-center font-bold">
          Post some photos to see them
        </p>
      ) : photos?.length > 0 ? (
        photos.map((content) => <Post key={content.docId} content={content} />)
      ) : null}
    </div>
  );
}
