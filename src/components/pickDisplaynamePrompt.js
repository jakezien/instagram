import { tr } from "date-fns/locale";
import { useState, useEffect } from "react";
import { doesUsernameExist } from "../services/firebase";
// import FirebaseContext from "../context/firebase";
// import UserContext from "../context/user";

export default function PickDisplayNamePrompt({comment, callback}) {
 
  const [displayName, setDisplayName] = useState("");
  const [isDisplayNameAvailable, setIsDisplayNameAvailable] = useState();
  const [isDisplayNameValid, setIsDisplayNameValid] = useState();

  const onInputChange = (e) => {
    const value = e.target.value
    if (value.length > 0) {
      let regex = /^(?=[a-zA-Z0-9._@-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      
      if (value < 3 || !value.match(regex)) {
        // invalid display name
        setIsDisplayNameValid(false)
        setDisplayName(value)
      } else {
        // valid display name
        setIsDisplayNameValid(true)
        setDisplayName(value)
        doesUsernameExist(value).then((doesExist) => {
          setIsDisplayNameAvailable(!doesExist);
        });
      }
    } else {
      // no display name
      setDisplayName("");
      setIsDisplayNameAvailable(null);
      setIsDisplayNameValid(null);
    }

  }
  
  useEffect(() => {
    if (typeof callback == 'function') callback({
      displayName: displayName,
      isDisplayNameAvailable: isDisplayNameAvailable,
      isDisplayNameValid: isDisplayNameValid
    })
  }, [displayName, isDisplayNameAvailable, isDisplayNameValid])

  return (
    <div className="px-4 py-2 bg-yellow-100 m-2 rounded-lg text-gray-500">
      <p className="text-gray-800"><strong>Before you comment, please pick a username:</strong></p>
      <div className="flex py-2">
        <input
          type="text"
          placeholder="username"
          value={displayName}
          onChange={onInputChange}
          className="border-b border-gray-400 p-2"
        />
        <div className="text-right p-2">
          {displayName.length > 0 && displayName.length < 3 && <p className="text-gray-500">It's gotta be at least 3 characters</p>}
          {displayName.length > 2 && isDisplayNameValid === false && <p className="text-red-800">Looks like something's not formatted correctly</p>}
          {(displayName?.length > 2) && isDisplayNameValid && (isDisplayNameAvailable ?
            <span className="text-gray-500"><span className="text-green-600">{displayName}</span> is available</span>
            : <span className="text-gray-500"><span className="text-red-800">{displayName}</span> isn't available :(</span>
          )}
        </div>
      </div>
    </div>
  );
}