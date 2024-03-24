import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import Checklist from "../../components/Checklist/Checklist";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

const ChecklistPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Checklist</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <Checklist />
      </IonContent>
    </IonPage>
  );
};

export default ChecklistPage;
