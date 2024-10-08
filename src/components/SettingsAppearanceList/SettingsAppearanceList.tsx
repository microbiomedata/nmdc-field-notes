import { IonItem, IonLabel, IonList } from "@ionic/react";
import ColorPaletteModeSelector from "../ColorPaletteModeSelector/ColorPaletteModeSelector";
import React from "react";
import paths from "../../paths";
import TourVisibilityManager from "../TourVisibilityManager/TourVisibilityManager";

const SettingsAppearanceList: React.FC = () => {
  return (
    <IonList className="ion-padding-bottom">
      <IonItem>
        <ColorPaletteModeSelector />
      </IonItem>
      <IonItem routerLink={paths.fieldVisibilitySettings}>
        <IonLabel>
          <h3>Field Visibility</h3>
        </IonLabel>
      </IonItem>
      <IonItem>
        <TourVisibilityManager />
      </IonItem>
    </IonList>
  );
};

export default SettingsAppearanceList;
