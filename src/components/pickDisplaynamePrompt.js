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
        doesUsernameExist(value).then((doesExist) => {
          setIsDisplayNameAvailable(!doesExist);
          setDisplayName(value)
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
    <div className="px-4 py-2">
      <p className="text-gray-800">Before you comment, please pick a username:</p>
      <div className="flex">
        <input type="text" placeholder="username" value={displayName} onChange={onInputChange} />
        <div className="text-right">
          {isDisplayNameValid === false && <p className="text-red-800">Hmm, you used a character that's not allowed</p>}
          {(displayName?.length > 2) && isDisplayNameValid && (isDisplayNameAvailable ?
            <span className="text-gray-500"><span className="text-green-600">{displayName}</span> is available</span>
            : <span className="text-gray-500"><span className="text-red-800">{displayName}</span> isn't available :(</span>
          )}
        </div>
      </div>
    </div>
  );
}