import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Tutorial from "../../components/Tutorial/Tutorial";

import "./TutorialPage.css";

const TutorialPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Tutorial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Tutorial />
      </IonContent>
    </IonPage>
  );
};

export default TutorialPage;
