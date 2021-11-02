import { useState, useContext } from "react"
import UserContext from "../../context/user";
import FirebaseContext from "../../context/firebase";
import { updateUsername } from "../../services/firebase";

export default function UpdateProfile() {
  const { user: loggedInUser } = useContext(UserContext);
  const [displayName, setDisplayName] = useState(loggedInUser?.displayName)
  const isInvalid = (!displayName || displayName === "");
  const { firebase } = useContext(FirebaseContext);

  function updateProfile() {
    console.log('update Profile', displayName)
    updateUsername(loggedInUser.uid, displayName)
  }

  return (
    <>
      { loggedInUser && (
        <div>
          <input
            aria-label="Username"
            type="text"
            placeholder="Username"
            className="text-m text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setDisplayName(target.value)}
            value={displayName}
          />
          <button
            disabled={isInvalid}
            type="submit"
            className={`bg-yellow-primary text-white w-full rounded h-10 font-bold ${isInvalid && "opacity-50"}`}
            onClick={updateProfile}
          >
            Save
          </button>
        </div>
      )}
    </>
  )

}