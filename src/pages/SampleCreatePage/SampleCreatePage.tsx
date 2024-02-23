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

interface SampleCreatePageParams {
  submissionId: string;
}

const SampleCreatePage: React.FC = () => {
  const { submissionId } = useParams<SampleCreatePageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>New Sample</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>New Sample</h2>
        <p>{submissionId}</p>
      </IonContent>
    </IonPage>
  );
};

export default SampleCreatePage;
