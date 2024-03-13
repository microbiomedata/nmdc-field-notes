import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useParams } from "react-router";
import { paths } from "../../Router";
import StudyForm from "../../components/StudyForm/StudyForm";
import { useSubmission } from "../../queries";
import { SubmissionMetadata, SubmissionMetadataCreate } from "../../api";

interface StudyEditPageParams {
  submissionId: string;
}

const StudyEditPage: React.FC = () => {
  const [present] = useIonToast();
  const { submissionId } = useParams<StudyEditPageParams>();
  const { query: submission, update } = useSubmission(submissionId);

  const handleSave = async (submission: SubmissionMetadataCreate) => {
    update.mutate(submission as SubmissionMetadata, {
      onSuccess: () => {
        present({
          message: "Study updated",
          duration: 3000,
          color: "success",
        });
      },
    });
  };

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
