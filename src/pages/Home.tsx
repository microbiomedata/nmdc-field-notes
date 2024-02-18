import React from "react";
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  create as studiesIcon,
  settings as settingsIcon,
} from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import SettingsView from "../components/SettingsView/SettingsView";
import HomeLayout from "../components/HomeLayout/HomeLayout";
import StudiesView from "../components/StudiesView/StudiesView";
import "./Home.css";

interface Props {
  /* Base path of this page. */
  basePath?: string;
}

export enum Path {
  STUDIES_VIEW = "/studies",
  SETTINGS_VIEW = "/settings",
}

const Home: React.FC<Props> = ({ basePath = "" }) => {
  return (
    <IonPage>
      {/* Note: The `IonTabs` element wraps two things: (a) an `IonRouterOutlet`, which wraps `Route`s
                to screens on which the associated `IonTabBar` will be visible; and (b) the `IonTabBar`,
                itself. This way of nesting the elements is shown in the Ionic docs.
                Reference: https://ionicframework.com/docs/react/navigation#working-with-tabs */}
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path={basePath + Path.STUDIES_VIEW}>
            <HomeLayout title={"Studies"}>
              <StudiesView />
            </HomeLayout>
          </Route>
          <Route exact path={basePath + Path.SETTINGS_VIEW}>
            <HomeLayout title={"Settings"}>
              <SettingsView />
            </HomeLayout>
          </Route>

          {/* Fallback route. */}
          <Redirect to={basePath + Path.SETTINGS_VIEW} />
        </IonRouterOutlet>

        {/* Tab bar at the bottom of the viewport. */}
        <IonTabBar slot={"bottom"}>
          <IonTabButton tab={"studies"} href={basePath + Path.STUDIES_VIEW}>
            <IonIcon icon={studiesIcon} />
            <IonLabel>Studies</IonLabel>
          </IonTabButton>
          <IonTabButton tab={"settings"} href={basePath + Path.SETTINGS_VIEW}>
            <IonIcon icon={settingsIcon} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
};

export default Home;
