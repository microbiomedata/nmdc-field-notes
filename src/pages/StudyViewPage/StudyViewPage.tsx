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
import useNavigationState from "../../useNavigationState";

interface StudyViewPageParams {
  submissionId: string;
}

export interface StudyViewPageLocationState {
  openSlotSelectorModalOnEnter?: boolean;
}

const StudyViewPage: React.FC = () => {
  const { submissionId } = useParams<StudyViewPageParams>();
  const state = useNavigationState<StudyViewPageLocationState>();

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
        <StudyView
          submissionId={submissionId}
          openSlotSelectorModalOnEnter={state?.openSlotSelectorModalOnEnter}
        />
      </IonContent>
    </IonPage>
  );
};

export default StudyViewPage;
