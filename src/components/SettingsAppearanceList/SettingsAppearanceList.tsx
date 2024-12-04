import { IonItem, IonList } from "@ionic/react";
import ColorPaletteModeSelector from "../ColorPaletteModeSelector/ColorPaletteModeSelector";
import React from "react";
import TourVisibilityManager from "../TourVisibilityManager/TourVisibilityManager";

const SettingsAppearanceList: React.FC = () => {
  return (
    <IonList className="ion-padding-bottom">
      <IonItem>
        <ColorPaletteModeSelector />
      </IonItem>
      <IonItem>
        <TourVisibilityManager />
      </IonItem>
    </IonList>
  );
};

export default SettingsAppearanceList;
