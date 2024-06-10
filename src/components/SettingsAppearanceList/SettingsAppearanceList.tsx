import { IonItem, IonList } from "@ionic/react";
import ColorPaletteModeSelector from "../ColorPaletteModeSelector/ColorPaletteModeSelector";
import React from "react";

const SettingsAppearanceList: React.FC = () => {
  return (
    <IonList className="ion-padding-bottom">
      <IonItem>
        <ColorPaletteModeSelector />
      </IonItem>
    </IonList>
  );
};

export default SettingsAppearanceList;
