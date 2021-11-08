import { useEffect, useContext, useState } from "react";
import { doesUsernameExist } from "../services/firebase";
import UserContext from "../context/user";

export default function UsernameInput({callback}) {

  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState();
  const [isUsernameValid, setIsUsernameValid] = useState();

  const onChange = (e) => {
    const value = e.target.value
    if (value.length > 0) {
      let regex = /^(?=[a-zA-Z0-9._@-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      
      if (value < 3 || !value.match(regex)) {
        // invalid display name
        setIsUsernameValid(false)
        setUsername(value)
      } else {
        // valid display name
        setIsUsernameValid(true)
        setUsername(value)
        doesUsernameExist(value).then((doesExist) => {
          setIsUsernameAvailable(!doesExist);
        });
      }
    } else {
      // no display name
      setUsername("");
      setIsUsernameAvailable(null);
      setIsUsernameValid(null);
    }
  }

  useEffect(() => {
    if (typeof callback == 'function') {
      callback({
        username: username,
        isUsernameValid: isUsernameValid,
        isUsernameAvailable: isUsernameAvailable
      })
    }
  }, [
    username,
    isUsernameValid,
    isUsernameAvailable
  ])

  return (
    <>    
      <div className="py-2 max-w-xs">
        {username.length === 0 && <p className="text-gray-500">Pick a username:</p>}
        {username.length > 0 && username.length < 3 && <p className="text-gray-500">It's gotta be at least 3 characters</p>}
        {username.toLowerCase() === 'jake' && <p className="text-gray-500">Nice try :)</p>}
        {username.length > 2 && isUsernameValid === false && <p className="text-red-800">Something's not allowed</p>}
        {(username?.length > 2) && isUsernameValid && (isUsernameAvailable ?
          <span className="text-gray-500"><span className="text-green-600">{username}</span> is available</span>
          : <span className="text-gray-500"><span className="text-red-800">{username}</span> isn't available :(</span>
        )}
      </div>
      <input
        type="text"
        autoCapitalize={false}
        autoCorrect={false}
        placeholder="username"
        value={username}
        onChange={onChange}
        className="border-b border-gray-400 p-2 mb-3 w-full"
      />
    </>
  )
}

// disabled={(comment.length < 1 || (!userUsername && !isDisplayNameValid) || (!userUsername && !isDisplayNameAvailable))}