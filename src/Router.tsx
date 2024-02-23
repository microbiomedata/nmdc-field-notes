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
import StudyEditPage from "./pages/StudyEditPage/StudyEditPage";
import SamplePage from "./pages/SamplePage/SamplePage";
import SampleCreatePage from "./pages/SampleCreatePage/SampleCreatePage";

const STUDY = "/study";
export const paths = {
  root: "/",
  home: "/home",
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
};

const Router: React.FC = () => {
  const { apiToken } = useStore();
  return (
    <IonReactRouter>
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
        <AuthRoute exact path={paths.studyView(":submissionId")}>
          <StudyViewPage />
        </AuthRoute>
        <AuthRoute exact path={paths.studyEdit(":submissionId")}>
          <StudyEditPage />
        </AuthRoute>
        <AuthRoute exact path={paths.sample(":submissionId", ":sampleIndex")}>
          <SamplePage />
        </AuthRoute>
        {/* Not sure why this needs to come after the view route, but it only works that way */}
        <AuthRoute exact path={paths.studyCreate}>
          <StudyCreatePage />
        </AuthRoute>
        <AuthRoute exact path={paths.sampleCreate(":submissionId")}>
          <SampleCreatePage />
        </AuthRoute>
        <AuthRoute exact path={paths.home}>
          <HomePage />
        </AuthRoute>
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
