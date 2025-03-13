import React from "react";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import config from "../../config";

const SettingsAboutList: React.FC = () => {
  return (
    <IonList className="ion-padding-bottom">
      <IonItem>
        <IonLabel>
          <h3>Version</h3>
          <p>
            {config.APP_VERSION} ({config.APP_BUILD})
          </p>
        </IonLabel>
      </IonItem>
      <IonItem
        detail={false}
        href={`mailto:${config.SUPPORT_EMAIL}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IonLabel>
          <h3>Contact us</h3>
          <p>Send an email with your comments or questions</p>
        </IonLabel>
      </IonItem>
    </IonList>
  );
};

export default SettingsAboutList;
