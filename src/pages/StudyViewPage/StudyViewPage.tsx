import React from "react";
import { useParams } from "react-router";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import StudyView from "../../components/StudyView/StudyView";

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
          <IonButtons slot="end">
            <IonButton routerLink={`/study/${id}/edit`}>Edit</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <StudyView submissionId={id} />
      </IonContent>
    </IonPage>
  );
};

export default StudyViewPage;
