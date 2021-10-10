/* eslint-disable no-nested-ternary */
import React, { useRef, useState, useContext } from "react";
import { SignInPromptContext } from "../context/sign-in-prompt";

const SignInPrompt = React.forwardRef((props, ref) => {
  const container = useRef(null)
  // const [showPrompt, setShowPrompt] = useState(props.showPrompt)

  const promptContext = useContext(SignInPromptContext)  
  const styles = "sticky top-0 w-screen bg-yellow-primary text-black-light bg-opacity-95 box-border border-b box-model border-gray-primary backdrop-filter backdrop-blur backdrop-saturate-150 h-16 p-2"

  return (
    <div ref={node => (container.current = node)} className={styles}>
        <button 
          aria-label="Close sign-in prompt" 
          className="float-right z-0 p-2 text-3xl leading-3 height-100" 
          onClick={() => promptContext.setShowPrompt(false)}
        >
          ✕
        </button>
        <p className="flex justify-center font-bold">
          Sign in to like and comment.
        </p>
        <p className="text-sm flex justify-center">
          Sign in with one click — no need to make an account :)
        </p>
    </div>
  );
})

export default SignInPrompt