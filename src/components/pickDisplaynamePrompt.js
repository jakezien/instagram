import { useState, useContext } from "react";
import { doesUsernameExist } from "../services/firebase";
// import FirebaseContext from "../context/firebase";
// import UserContext from "../context/user";

export default function PickDisplayNamePrompt(comment) {
 
  const [displayName, setDisplayName] = useState("");
  const [isDisplayNameAvailable, setIsDisplayNameAvailable] = useState();
  const [isDisplayNameValid, setIsDisplayNameValid] = useState();

  const onInputChange = (e) => {
    if (e.target.value.length > 0) {
      const value = e.target.value
      let regex = /^(?=[a-zA-Z0-9._@-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      
      if (value < 3 || !value.match(regex)) {
        setIsDisplayNameValid(false)
        setDisplayName(value)
      } else {
        setIsDisplayNameValid(true)
        doesUsernameExist(value).then((doesExist) => {
          setIsDisplayNameAvailable(!doesExist);
        });
        setDisplayName(value)
      }
    } else {
      setDisplayName("");
      setIsDisplayNameAvailable(null);
      setIsDisplayNameValid(null);
    }
  }

  return (
    <div className="px-4 py-2">
      <p className="text-gray-800">Before you comment, please pick a username:</p>
      <div className="flex">
        <input type="text" placeholder="username" value={displayName} onChange={onInputChange} />
        <div className="text-right">
          {(displayName?.length > 2) && (isDisplayNameAvailable ?
            <span className="text-gray-500"><span className="text-green-600">{displayName}</span> is available</span>
            : <span className="text-gray-500"><span className="text-red-800">{displayName}</span> isn't available :(</span>
          )}
        </div>
      </div>
    </div>
  );
}