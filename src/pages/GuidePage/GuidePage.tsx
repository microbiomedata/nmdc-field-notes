import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import Checklist from "../../components/Checklist/Checklist";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

const GuidePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
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
