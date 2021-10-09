import { useState, useEffect } from "react";
import { getUserByUserId, getUserByUsername } from "../services/firebase";
import { JAKE_USERNAME } from "../constants/jake"

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user || {});
    }

    async function getUserObjForJake() {
      const [user] = await getUserByUsername(JAKE_USERNAME)
      setActiveUser (user || {})
    }

    if (userId) {
      if (userId == JAKE_USERNAME) {
        getUserObjForJake()
      } else {
        getUserObjByUserId(userId);
      }
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}
