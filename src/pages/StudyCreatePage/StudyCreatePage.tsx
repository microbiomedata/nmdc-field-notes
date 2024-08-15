import React, { useMemo } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import StudyForm from "../../components/StudyForm/StudyForm";
import { useSubmissionCreate } from "../../queries";
import { SubmissionMetadataCreate } from "../../api";
import paths from "../../paths";
import { initSubmission } from "../../data";
import { checkmark } from "ionicons/icons";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import { useNetworkStatus } from "../../NetworkStatus";
import FixedCenteredMessage from "../../components/FixedCenteredMessage/FixedCenteredMessage";

const StudyCreatePage: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const submissionCreate = useSubmissionCreate();
  const submission = useMemo(initSubmission, []);
  const { isOnline } = useNetworkStatus();

  const handleSave = async (submission: SubmissionMetadataCreate) => {
    submissionCreate.mutate(submission, {
      onSuccess: (created) => {
        present({
          message: "Study created",
          duration: 3000,
          icon: checkmark,
        });
        router.push(paths.studyView(created.id), "forward", "replace");
      },
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={paths.home}></IonBackButton>
          </IonButtons>
          <IonTitle>New Study</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        {isOnline ? (
          <StudyForm submission={submission} onSave={handleSave} />
        ) : (
          <FixedCenteredMessage>
            Study creation is disabled while offline. Please try again when
            online.
          </FixedCenteredMessage>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StudyCreatePage;
