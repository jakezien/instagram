import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Header from "../components/header";
import Timeline from "../components/timeline";
import Sidebar from "../components/sidebar";
import useUser from "../hooks/use-user";



export default function Feed() {
  
  useEffect(() => {
    document.title = "Jakestagram";
  }, []);
  

  return(
    <div className="bg-gray-background">
    <Header />
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <Timeline />
    </div>
  </div>
  )
}

Feed.propTypes = {
  user: PropTypes.object,
};
