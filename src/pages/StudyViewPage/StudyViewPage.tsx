import React from "react";
import { useParams } from "react-router";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface StudyViewPageParams {
  id: string;
}

const StudyViewPage: React.FC = () => {
  const { id } = useParams<StudyViewPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>{id}</h2>
      </IonContent>
    </IonPage>
  );
};

export default StudyViewPage;
