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

export const PATHS = {
  ROOT: "/",
  HOME_PAGE: "/home",
  TUTORIAL_PAGE: "/tutorial",
  WELCOME_PAGE: "/welcome",
  LOGIN_PAGE: "/login",
  TOKEN_PAGE: "/token",
  LOGOUT_PAGE: "/logout",
};

const Router: React.FC = () => {
  const { apiToken } = useStore();
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path={PATHS.LOGIN_PAGE}>
          <LoginPage />
        </Route>
        <Route path={PATHS.LOGOUT_PAGE}>
          <LogoutPage />
        </Route>
        <Route path={PATHS.TOKEN_PAGE}>
          <TokenPage />
        </Route>
        <Route exact path={PATHS.WELCOME_PAGE}>
          <WelcomePage />
        </Route>
        <Route exact path={PATHS.TUTORIAL_PAGE}>
          <TutorialPage />
        </Route>
        <AuthRoute exact path={PATHS.HOME_PAGE}>
          <Home />
        </AuthRoute>
        <Route exact path={PATHS.ROOT}>
          <Redirect to={apiToken ? PATHS.HOME_PAGE : PATHS.WELCOME_PAGE} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Router;
