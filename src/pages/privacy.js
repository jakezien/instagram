import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Header from "../components/header";
import Timeline from "../components/timeline";
import Sidebar from "../components/sidebar";
import useUser from "../hooks/use-user";
import LoggedInUserContext from "../context/logged-in-user";



export default function Dashboard({ user: loggedInUser }) {
  
  useEffect(() => {
    document.title = "Privacy - Jakestagram";
  }, []);

    return(
      <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <h1>I will never sell your info.</h1>
        <p>I'll delete your stuff if you email me and ask.</p>
      </div>
    </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
