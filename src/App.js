import { lazy, Suspense, useRef } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactLoader from "./components/loader";
import * as ROUTES from "./constants/routes";
import UserContext from "./context/user";
import { SignInPromptContextProvider } from "./context/sign-in-prompt";
import useAuthListener from "./hooks/use-auth-listener";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = lazy(() => import("./pages/login"));
const SignIn = lazy(() => import("./pages/sign-in"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Feed = lazy(() => import("./pages/feed"));
const Profile = lazy(() => import("./pages/profile"));
const NotFound = lazy(() => import("./pages/not-found"));
const AddPhoto = lazy(() => import("./pages/add-photo"));
const SignInEmail = lazy(() => import("./pages/sign-in-email"));


export default function App() {
  const { user } = useAuthListener();
  const signInPrompt = useRef()

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<ReactLoader />}>
          <SignInPromptContextProvider>

            <Switch>
              <Route path={ROUTES.LOGIN} component={Login} />
              <Route path={ROUTES.SIGN_IN} component={SignIn} />
              <Route path={ROUTES.PROFILE} component={Profile} />
              <Route path={ROUTES.DASHBOARD} component={Dashboard} />
              <Route path={ROUTES.ADD_PHOTO} component={AddPhoto} />
              <Route path={ROUTES.SIGN_IN_EMAIL} component={SignInEmail} />
              <Route path={ROUTES.FEED} component={Feed} />
              <Route component={NotFound} />
            </Switch>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </SignInPromptContextProvider>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}
