import React from "react";
import { RouteComponentProps } from "react-router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SubmissionForm from "../components/SubmissionForm.tsx.x";

interface SubmissionViewPageProps extends RouteComponentProps<{ id: string }> {}

const SubmissionViewPage: React.FC<SubmissionViewPageProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Submission Edit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Submission Edit</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SubmissionForm id={match.params.id} />
      </IonContent>
    </IonPage>
  );
};

export default SubmissionViewPage;
