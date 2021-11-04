import { useState, useContext } from "react"
import UserContext from "../../context/user";
import { updateUsername } from "../../services/firebase";
import UsernameInput from "../usernameInput";
import { toast } from "react-toastify";

export default function UpdateProfile() {
  const { user } = useContext(UserContext);
  const [username, setUsername]  = useState()
  const [isUsernameValid, setIsUsernameValid]  = useState()
  const [isUsernameAvailable, setIsUsernameAvailable]  = useState()

  function onUsernameInputChange(e) {
    setUsername(e.username)
    setIsUsernameValid(e.isUsernameValid)
    setIsUsernameAvailable(e.isUsernameAvailable)
  }

  function updateProfile() {
    updateUsername(user.uid, username)
  }

  return (
    <>
      { user && (
        <div>
          <UsernameInput callback={onUsernameInputChange}/>
          <button
            disabled={!isUsernameValid || !isUsernameAvailable}
            type="submit"
            className={`bg-yellow-primary text-white w-full rounded h-10 font-bold disabled:cursor-pointer disabled:opacity-30`}
            onClick={updateProfile}
          >
            Save
          </button>
        </div>
      )}
    </>
  )

}