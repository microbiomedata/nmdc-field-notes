import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface Props {
  title?: string;
  body?: string;
}

/**
 * This is a basic page we can use for demonstration purposes during development.
 *
 * TODO: Delete this placeholder component once we think we won't use it anymore.
 */
const PlaceholderPage: React.FC<Props> = ({ title, body }) => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={"ion-padding"}>
        {body}
      </IonContent>
    </IonPage>
  );
};

export default PlaceholderPage;
