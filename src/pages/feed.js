import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Header from "../components/header";
import Timeline from "../components/timeline";
import SignInPrompt from "../components/signInPrompt";
// import Sidebar from "../components/sidebar";
// import useUser from "../hooks/use-user";



export default function Feed() {
  
  useEffect(() => {
    document.title = "Jakestagram";
  }, []);
  

  return(
    <div className="bg-white dark:bg-black">
    <Header />
    {/* <SignInPrompt ref={}/> */}
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <Timeline />
    </div>
  </div>
  )
}
