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
import { paths } from "../../Router";

interface StudyViewPageParams {
  submissionId: string;
}

const StudyViewPage: React.FC = () => {
  const { submissionId } = useParams<StudyViewPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Study</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={paths.studyEdit(submissionId)}>
              Edit
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <StudyView submissionId={submissionId} />
      </IonContent>
    </IonPage>
  );
};

export default StudyViewPage;
