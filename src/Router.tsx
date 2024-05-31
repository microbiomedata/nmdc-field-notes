import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import TokenPage from "./pages/TokenPage/TokenPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ChecklistPage from "./pages/ChecklistPage/ChecklistPage";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./pages/HomePage/HomePage";
import { useStore } from "./Store";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import StudyViewPage from "./pages/StudyViewPage/StudyViewPage";
import StudyCreatePage from "./pages/StudyCreatePage/StudyCreatePage";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import PlaceholderPage from "./pages/PlaceholderPage";
import StudyEditPage from "./pages/StudyEditPage/StudyEditPage";
import SamplePage from "./pages/SamplePage/SamplePage";
import GuidePage from "./pages/GuidePage/GuidePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import AppUrlListener from "./components/AppUrlListener/AppUrlListener";

const IN = "/in";
const STUDY = `${IN}/study`;
export const paths = {
  root: "/",
  home: STUDY,
  checklist: "/checklist",
  tour: "/tour",
  welcome: "/welcome",
  login: "/login",
  token: "/token",
  logout: "/logout",
  studyCreate: `${STUDY}/create`,
  studyView: (submissionId: string) => `${STUDY}/${submissionId}`,
  studyEdit: (submissionId: string) => `${STUDY}/${submissionId}/edit`,
  sample: (submissionId: string, sampleIndex: string | number) =>
    `${STUDY}/${submissionId}/sample/${sampleIndex}`,
  guide: `${IN}/guide`,
  settings: `${IN}/settings`,
};

const Router: React.FC = () => {
  const { apiToken } = useStore();
  return (
    <IonReactRouter>
      <AppUrlListener />
      <IonRouterOutlet>
        <Route exact path={paths.login}>
          <LoginPage />
        </Route>
        <Route exact path={paths.logout}>
          <LogoutPage />
        </Route>
        <Route exact path={paths.token}>
          <TokenPage />
        </Route>
        <Route exact path={paths.welcome}>
          <WelcomePage />
        </Route>
        <Route exact path={paths.checklist}>
          <ChecklistPage />
        </Route>
        <Route exact path={paths.tour}>
          <PlaceholderPage title={"Tour"} body={"Take a tour of the app"} />
        </Route>

        <Route path={IN}>
          <TabNavigator>
            {/* STUDIES TAB ROUTES */}
            {/* It's unclear why the /create routes need to be listed after the /:id routes. It
                seems backwards from what the react-router docs suggest, but it's what works. */}
            <AuthRoute exact path={paths.studyView(":submissionId")}>
              <StudyViewPage />
            </AuthRoute>
            <AuthRoute exact path={paths.studyCreate}>
              <StudyCreatePage />
            </AuthRoute>
            <AuthRoute exact path={paths.studyEdit(":submissionId")}>
              <StudyEditPage />
            </AuthRoute>
            <AuthRoute
              exact
              path={paths.sample(":submissionId", ":sampleIndex")}
            >
              <SamplePage />
            </AuthRoute>
            <AuthRoute exact path={paths.home}>
              <HomePage />
            </AuthRoute>

            {/* GUIDE TAB ROUTES */}
            <AuthRoute exact path={paths.guide}>
              <GuidePage />
            </AuthRoute>

            {/* SETTINGS TAB ROUTES */}
            <AuthRoute exact path={paths.settings}>
              <SettingsPage />
            </AuthRoute>

            {/* Fallback route for when the requested path doesn't match any of the above paths. */}
            <Redirect to={paths.home} />
          </TabNavigator>
        </Route>

        <Route exact path={paths.root}>
          <Redirect to={apiToken ? paths.home : paths.welcome} />
        </Route>
        {/* Fallback route for when the requested path doesn't match any of the above paths. */}
        <Redirect to={paths.root} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Router;
