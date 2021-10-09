import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Header from "../components/header";
import Timeline from "../components/timeline";
import Sidebar from "../components/sidebar";
import useUser from "../hooks/use-user";
import LoggedInUserContext from "../context/logged-in-user";



export default function Dashboard({ user: loggedInUser }) {
  
  useEffect(() => {
    document.title = "Jakestagram";
  }, []);

  if (loggedInUser) {
    const { user, setActiveUser } = useUser(loggedInUser.uid);
    return (
      <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
        <div className="bg-gray-background">
          <Header />
          <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
            <Timeline />
            <Sidebar />
          </div>
        </div>
      </LoggedInUserContext.Provider>
    );
  }
  
  else {
    return(
      <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <Timeline />
        <Sidebar />
      </div>
    </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
