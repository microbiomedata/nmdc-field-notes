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
import { useParams } from "react-router";

interface StudyEditPageParams {
  id: string;
}

const StudyEditPage: React.FC = () => {
  const { id } = useParams<StudyEditPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/study/${id}`}></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>{id}</h2>
      </IonContent>
    </IonPage>
  );
};

export default StudyEditPage;
