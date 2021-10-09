import { useState, useEffect } from "react";
import { getUserByUserId, getUserByUsername } from "../services/firebase";
import { JAKE_USERNAME } from "../constants/jake"

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();
  const [jake, setJake] = useState();

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user || {});
    }

    async function getUserObjForJake() {
      const [j] = await getUserByUsername(JAKE_USERNAME)
      setJake (j || {})
    }

    if (userId) {
      if (userId == JAKE_USERNAME) {
        getUserObjForJake()
        getUserObjByUserId(userId);
      }
    }
  }, [userId]);

  return { jake: jake, user: activeUser, setActiveUser };
}
