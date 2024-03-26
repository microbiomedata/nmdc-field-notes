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

const GuidePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot={"start"}>
            <IonBackButton defaultHref={"/"}></IonBackButton>
          </IonButtons>
          <IonTitle>Guide</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <Checklist />
      </IonContent>
    </IonPage>
  );
};

export default GuidePage;
