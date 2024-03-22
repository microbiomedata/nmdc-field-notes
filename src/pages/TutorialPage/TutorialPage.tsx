import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import Tutorial from "../../components/Tutorial/Tutorial";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

import "./TutorialPage.css";

const TutorialPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Tutorial</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <Tutorial />
      </IonContent>
    </IonPage>
  );
};

export default TutorialPage;
