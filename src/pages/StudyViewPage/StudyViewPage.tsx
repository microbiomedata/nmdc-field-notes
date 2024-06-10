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
} from "@ionic/react";
import StudyView from "../../components/StudyView/StudyView";
import paths from "../../paths";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

interface StudyViewPageParams {
  submissionId: string;
}

const StudyViewPage: React.FC = () => {
  const { submissionId } = useParams<StudyViewPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={paths.home}></IonBackButton>
          </IonButtons>
          <IonTitle>Study</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={paths.studyEdit(submissionId)}>
              Edit
            </IonButton>
          </IonButtons>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <StudyView submissionId={submissionId} />
      </IonContent>
    </IonPage>
  );
};

export default StudyViewPage;
