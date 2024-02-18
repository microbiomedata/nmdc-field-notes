import React, { PropsWithChildren } from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  create as studiesIcon,
  settings as settingsIcon,
} from "ionicons/icons";
import { PATHS } from "../../Router";

interface Props extends PropsWithChildren {}

const TabNavigator: React.FC<Props> = ({ children }) => {
  // Note: The `IonTabs` element wraps two things: (a) an `IonTabBar` element, which will appear as a horizontal navbar
  //       at the bottom of the viewport; and (b) an `IonRouterOutlet` element containing the passed-in routes to views,
  //       each of which will share the viewport with the navbar. This element hierarchy is shown in the Ionic docs.
  //       Reference: https://ionicframework.com/docs/react/navigation#working-with-tabs
  return (
    <IonTabs>
      <IonRouterOutlet>{children}</IonRouterOutlet>

      {/* Tab navigation bar at the bottom of the viewport. */}
      <IonTabBar slot={"bottom"}>
        <IonTabButton tab={"studies"} href={PATHS.STUDIES_VIEW}>
          <IonIcon icon={studiesIcon} />
          <IonLabel>Studies</IonLabel>
        </IonTabButton>
        <IonTabButton tab={"settings"} href={PATHS.SETTINGS_VIEW}>
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabNavigator;
