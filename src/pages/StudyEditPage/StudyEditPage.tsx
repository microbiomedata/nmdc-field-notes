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
import { paths } from "../../Router";

interface StudyEditPageParams {
  submissionId: string;
}

const StudyEditPage: React.FC = () => {
  const { submissionId } = useParams<StudyEditPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={paths.studyView(submissionId)}
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>{submissionId}</h2>
      </IonContent>
    </IonPage>
  );
};

export default StudyEditPage;
