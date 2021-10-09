import { useState, useEffect } from "react";
import { getJakePhotos } from "../services/firebase";


export default function useJakePhotos() {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    async function getPhotos() {
      const jakePhotos = await getJakePhotos()
      // re-arrange array to be newest photos first by dateCreated
      jakePhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setPhotos(jakePhotos);
    }

    getPhotos();
  }, []);

  return { photos };
}
