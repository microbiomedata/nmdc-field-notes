import React from "react";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import config from "../../config";

const SettingsAboutList: React.FC = () => {
  return (
    <IonList className="ion-padding-bottom">
      <IonItem>
        <IonLabel>
          <h3>Version</h3>
          <p>{config.APP_VERSION}</p>
        </IonLabel>
      </IonItem>
    </IonList>
  );
};

export default SettingsAboutList;
