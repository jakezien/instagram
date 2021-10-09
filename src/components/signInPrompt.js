/* eslint-disable no-nested-ternary */
import React, { useRef, useState, useContext } from "react";
import { SignInPromptContext } from "../context/sign-in-prompt";

const SignInPrompt = React.forwardRef((props, ref) => {
  const container = useRef(null)
  // const [showPrompt, setShowPrompt] = useState(props.showPrompt)

  const promptContext = useContext(SignInPromptContext)  
  const styles = "bg-white container sticky top-0 w-screen "

  return (
    <div ref={node => (container.current = node)} className={styles + (promptContext.showPrompt ? 'block' : 'hidden')}>
        <button 
          aria-label="Close this prompt" 
          className="float-right z-0 p-2 text-3xl" 
          onClick={() => promptContext.setShowPrompt(false)}
        >
          ✕
        </button>
        <p className="flex bg-yellow-500 justify-center font-bold">
          Sign in to like and comment.
        </p>
        <p className="text-sm flex justify-center">
          Sign in with one click — no need to make an account :)
        </p>
    </div>
  );
})

export default SignInPrompt