import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import TokenPage from "./pages/TokenPage/TokenPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import Home from "./pages/Home";
import { useStore } from "./Store";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import StudyViewPage from "./pages/StudyViewPage/StudyViewPage";
import StudyCreatePage from "./pages/StudyCreatePage/StudyCreatePage";

export const PATHS = {
  ROOT: "/",
  HOME_PAGE: "/home",
  TUTORIAL_PAGE: "/tutorial",
  WELCOME_PAGE: "/welcome",
  LOGIN_PAGE: "/login",
  TOKEN_PAGE: "/token",
  LOGOUT_PAGE: "/logout",
  STUDY_CREATE_PAGE: "/study/create",
  STUDY_VIEW_PAGE: "/study/:id",
};

const Router: React.FC = () => {
  const { apiToken } = useStore();
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path={PATHS.LOGIN_PAGE}>
          <LoginPage />
        </Route>
        <Route exact path={PATHS.LOGOUT_PAGE}>
          <LogoutPage />
        </Route>
        <Route exact path={PATHS.TOKEN_PAGE}>
          <TokenPage />
        </Route>
        <Route exact path={PATHS.WELCOME_PAGE}>
          <WelcomePage />
        </Route>
        <Route exact path={PATHS.TUTORIAL_PAGE}>
          <TutorialPage />
        </Route>
        <AuthRoute path={PATHS.STUDY_VIEW_PAGE}>
          <StudyViewPage />
        </AuthRoute>
        {/* Not sure why this needs to come after the view route, but it only works that way */}
        <AuthRoute exact path={PATHS.STUDY_CREATE_PAGE}>
          <StudyCreatePage />
        </AuthRoute>
        <AuthRoute exact path={PATHS.HOME_PAGE}>
          <Home />
        </AuthRoute>
        <Route exact path={PATHS.ROOT}>
          <Redirect to={apiToken ? PATHS.HOME_PAGE : PATHS.WELCOME_PAGE} />
        </Route>
        {/* Fallback route for when the requested path doesn't match any of the above paths. */}
        <Redirect to={PATHS.ROOT} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Router;
