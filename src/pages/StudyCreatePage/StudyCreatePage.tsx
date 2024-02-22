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

const StudyCreatePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>New Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>New Study</h2>
      </IonContent>
    </IonPage>
  );
};

export default StudyCreatePage;
