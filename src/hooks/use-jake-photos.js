import { useState, useEffect, useContext } from "react";
import { getJakePhotos } from "../services/firebase";
import UserContext from "../context/user";

export default function useJakePhotos() {
  const [photos, setPhotos] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getPhotos() {
      const jakePhotos = await getJakePhotos(user?.uid)
      // re-arrange array to be newest photos first by dateCreated
      jakePhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setPhotos(jakePhotos);
    }

    getPhotos();
  }, []);

  return { photos };
}
