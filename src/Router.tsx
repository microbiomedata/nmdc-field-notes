import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import TokenPage from "./pages/TokenPage/TokenPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import { useStore } from "./Store";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import HomeLayout from "./components/HomeLayout/HomeLayout";
import StudiesView from "./components/StudiesView/StudiesView";
import SettingsView from "./components/SettingsView/SettingsView";
import StudyView from "./components/StudyView/StudyView";

export const PATHS = {
  ROOT: "/",
  HOME_PAGE: "/home",
  TUTORIAL_PAGE: "/tutorial",
  WELCOME_PAGE: "/welcome",
  LOGIN_PAGE: "/login",
  TOKEN_PAGE: "/token",
  LOGOUT_PAGE: "/logout",
  STUDIES_VIEW: "/home/studies",
  SETTINGS_VIEW: "/home/settings",
  STUDY_VIEW: {
    pattern: "/home/studies/:id",
    makePath: (id: string) => `/home/studies/${encodeURIComponent(id)}`,
  },
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
        <AuthRoute path={PATHS.HOME_PAGE}>
          <TabNavigator>
            <Route exact path={PATHS.STUDY_VIEW.pattern}>
              <HomeLayout title={"Study"}>
                <StudyView />
              </HomeLayout>
            </Route>
            <Route exact path={PATHS.STUDIES_VIEW}>
              <HomeLayout title={"Studies"}>
                <StudiesView />
              </HomeLayout>
            </Route>
            <Route exact path={PATHS.SETTINGS_VIEW}>
              <HomeLayout title={"Settings"}>
                <SettingsView />
              </HomeLayout>
            </Route>
            <Redirect to={PATHS.SETTINGS_VIEW} />
          </TabNavigator>
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
