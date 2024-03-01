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
  map as guideIcon,
  settings as settingsIcon,
} from "ionicons/icons";
import { paths } from "../../Router";

interface Props extends PropsWithChildren {}

const TabNavigator: React.FC<Props> = ({ children }) => {
  // Note: As shown in the Ionic docs, this `IonTabs` element wraps two things:
  //       (a) an `IonTabBar` element, which will appear as a horizontal navbar at the bottom of the viewport; and
  //       (b) an `IonRouterOutlet` element containing the passed-in routes to components, each of which will share the
  //           viewport with the aforementioned navbar.
  //       Reference: https://ionicframework.com/docs/react/navigation#working-with-tabs
  return (
    <IonTabs>
      <IonRouterOutlet>{children}</IonRouterOutlet>

      {/* Tab navigation bar at the bottom of the viewport. */}
      <IonTabBar slot={"bottom"}>
        <IonTabButton tab={"studies"} href={paths.home}>
          <IonIcon icon={studiesIcon} />
          <IonLabel>Studies</IonLabel>
        </IonTabButton>
        <IonTabButton tab={"guide"} href={paths.guide}>
          <IonIcon icon={guideIcon} />
          <IonLabel>Guide</IonLabel>
        </IonTabButton>
        <IonTabButton tab={"settings"} href={paths.settings}>
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabNavigator;
