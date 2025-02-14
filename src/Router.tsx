import React, { useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import TokenPage from "./pages/TokenPage/TokenPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ChecklistPage from "./pages/ChecklistPage/ChecklistPage";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./pages/HomePage/HomePage";
import StudyViewPage from "./pages/StudyViewPage/StudyViewPage";
import StudyCreatePage from "./pages/StudyCreatePage/StudyCreatePage";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import StudyEditPage from "./pages/StudyEditPage/StudyEditPage";
import SamplePage from "./pages/SamplePage/SamplePage";
import GuidePage from "./pages/GuidePage/GuidePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import AppUrlListener from "./components/AppUrlListener/AppUrlListener";
import RootPage from "./pages/RootPage/RootPage";
import paths, { IN } from "./paths";
import AnalyticsScreenViewListener from "./AnalyticsScreenViewListener";
import TokenRefreshErrorBoundary from "./components/TokenRefreshErrorBoundary/TokenRefreshErrorBoundary";
import RefreshTokenExpirationMonitor from "./components/RefreshTokenExpirationMonitor/RefreshTokenExpirationMonitor";

const Router: React.FC = () => {
  return (
    <IonReactRouter>
      <AppUrlListener />
      <AnalyticsScreenViewListener />
      <RefreshTokenExpirationMonitor />
      <IonRouterOutlet>
        <Route exact path={paths.token}>
          <TokenPage />
        </Route>
        <Route exact path={paths.welcome}>
          <WelcomePage />
        </Route>
        <Route exact path={paths.checklist}>
          <ChecklistPage />
        </Route>

        {/*
        TAB ROUTES
        Be cautious about adding nested routes here. They seem to confuse the Ionic router. And
        definitely never attempt to route *between* tabs.
        See also: https://ionicframework.com/docs/react/navigation#switching-between-tabs
        */}
        <Route path={IN}>
          <TabNavigator>
            <Route exact path={paths.home}>
              <TokenRefreshErrorBoundary>
                <HomePage />
              </TokenRefreshErrorBoundary>
            </Route>

            <Route exact path={paths.guide}>
              <GuidePage />
            </Route>

            <Route exact path={paths.settings}>
              <SettingsPage />
            </Route>
          </TabNavigator>
        </Route>

        {/*
        STUDIES ROUTES
        It is unclear why the /create routes need to be listed after the /:id routes. It
        seems backwards from what the react-router docs suggest, but it's what works.
        */}
        <AuthRoute
          exact
          path={paths.sample(":submissionId", ":template", ":sampleIndex")}
        >
          <SamplePage />
        </AuthRoute>
        <AuthRoute exact path={paths.studyEdit(":submissionId")}>
          <StudyEditPage />
        </AuthRoute>
        <AuthRoute exact path={paths.studyView(":submissionId")}>
          <StudyViewPage />
        </AuthRoute>
        <AuthRoute exact path={paths.studyCreate}>
          <StudyCreatePage />
        </AuthRoute>

        <Route exact path={paths.root}>
          <RootPage />
        </Route>

        {/* Fallback route for when the requested path doesn't match any of the above paths. */}
        <Redirect to={paths.root} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Router;
