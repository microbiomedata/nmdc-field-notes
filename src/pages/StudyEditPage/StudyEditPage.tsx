import React from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonProgressBar,
  IonTitle,
  useIonAlert,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useParams } from "react-router";
import { paths } from "../../Router";
import StudyForm from "../../components/StudyForm/StudyForm";
import { useSubmission } from "../../queries";
import { SubmissionMetadata, SubmissionMetadataCreate } from "../../api";
import {
  checkmark,
  ellipsisHorizontal,
  ellipsisVertical,
} from "ionicons/icons";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

interface StudyEditPageParams {
  submissionId: string;
}

const StudyEditPage: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const { submissionId } = useParams<StudyEditPageParams>();
  const {
    query: submission,
    updateMutation,
    deleteMutation,
  } = useSubmission(submissionId);

  const handleSave = async (submission: SubmissionMetadataCreate) => {
    updateMutation.mutate(submission as SubmissionMetadata, {
      onSuccess: () => {
        presentToast({
          message: "Study updated",
          duration: 3000,
          icon: checkmark,
        });
      },
    });
  };

  const handleDeleteInitiate = () => {
    presentAlert({
      header: "Delete Study",
      message:
        "Are you sure you want to delete this study? All associated sample data will be deleted as well.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            deleteMutation.mutate(submissionId, {
              onSuccess: () => router.push(paths.home, "back"),
            });
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={paths.studyView(submissionId)}
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Study</IonTitle>
          <IonButtons slot="primary">
            <IonButton id="ellipsis-menu-trigger">
              <IonIcon
                slot="icon-only"
                ios={ellipsisHorizontal}
                md={ellipsisVertical}
              ></IonIcon>
            </IonButton>
          </IonButtons>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <IonPopover
          trigger="ellipsis-menu-trigger"
          triggerAction="click"
          dismissOnSelect
        >
          <IonContent>
            <IonList lines="none">
              <IonItem button detail={false} onClick={handleDeleteInitiate}>
                Delete Study
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonProgressBar
          type="indeterminate"
          style={{
            visibility:
              submission.isFetching || submission.isLoading
                ? "visible"
                : "hidden",
          }}
        />
        {submission.data && (
          <StudyForm submission={submission.data} onSave={handleSave} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default StudyEditPage;
