import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import TokenPage from "./pages/TokenPage/TokenPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./pages/HomePage/HomePage";
import { useStore } from "./Store";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import StudyViewPage from "./pages/StudyViewPage/StudyViewPage";
import StudyCreatePage from "./pages/StudyCreatePage/StudyCreatePage";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import PlaceholderPage from "./pages/PlaceholderPage";

export const PATHS = {
  ROOT: "/",
  HOME_PAGE: "/in/study",
  TUTORIAL_PAGE: "/tutorial",
  WELCOME_PAGE: "/welcome",
  LOGIN_PAGE: "/login",
  TOKEN_PAGE: "/token",
  LOGOUT_PAGE: "/logout",
  STUDY_CREATE_PAGE: "/in/study/create",
  STUDY_VIEW_PAGE: "/in/study/:id",
  TABBED_AREA: "/in",
  GUIDE_PAGE: "/in/guide",
  SETTINGS_PAGE: "/in/settings",
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

        <Route path={PATHS.TABBED_AREA}>
          <TabNavigator>
            <AuthRoute path={PATHS.STUDY_VIEW_PAGE}>
              <StudyViewPage />
            </AuthRoute>
            {/* Not sure why this needs to come after the view route, but it only works that way */}
            <AuthRoute exact path={PATHS.STUDY_CREATE_PAGE}>
              <StudyCreatePage />
            </AuthRoute>
            <AuthRoute exact path={PATHS.HOME_PAGE}>
              <HomePage />
            </AuthRoute>
            <AuthRoute exact path={PATHS.GUIDE_PAGE}>
              <PlaceholderPage
                title={"Guide"}
                body={"Base route on Guide tab"}
              />
            </AuthRoute>
            <AuthRoute exact path={PATHS.SETTINGS_PAGE}>
              <PlaceholderPage
                title={"Settings"}
                body={"Base route on Settings tab"}
              />
            </AuthRoute>
            {/* Fallback route for when the requested path doesn't match any of the above paths. */}
            <Redirect to={PATHS.HOME_PAGE} />
          </TabNavigator>
        </Route>

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
