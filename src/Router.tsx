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
import StudyEditPage from "./pages/StudyEditPage/StudyEditPage";
import SamplePage from "./pages/SamplePage/SamplePage";
import SampleCreatePage from "./pages/SampleCreatePage/SampleCreatePage";
import AppUrlListener from "./components/AppUrlListener/AppUrlListener";

const IN = "/in";
const STUDY = `${IN}/study`;
export const paths = {
  root: "/",
  home: STUDY,
  tutorial: "/tutorial",
  welcome: "/welcome",
  login: "/login",
  token: "/token",
  logout: "/logout",
  studyCreate: `${STUDY}/create`,
  studyView: (submissionId: string) => `${STUDY}/${submissionId}`,
  studyEdit: (submissionId: string) => `${STUDY}/${submissionId}/edit`,
  sample: (submissionId: string, sampleIndex: string | number) =>
    `${STUDY}/${submissionId}/sample/${sampleIndex}`,
  sampleCreate: (submissionId: string) =>
    `${STUDY}/${submissionId}/sample/create`,
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
        <Route exact path={paths.tutorial}>
          <TutorialPage />
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
            <AuthRoute exact path={paths.sampleCreate(":submissionId")}>
              <SampleCreatePage />
            </AuthRoute>
            <AuthRoute exact path={paths.home}>
              <HomePage />
            </AuthRoute>

            {/* GUIDE TAB ROUTES */}
            <AuthRoute exact path={paths.guide}>
              <PlaceholderPage
                title={"Guide"}
                body={"Base route on Guide tab"}
              />
            </AuthRoute>

            {/* SETTINGS TAB ROUTES */}
            <AuthRoute exact path={paths.settings}>
              <PlaceholderPage
                title={"Settings"}
                body={"Base route on Settings tab"}
              />
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
