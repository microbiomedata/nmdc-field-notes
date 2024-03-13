import React, { useMemo } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import StudyForm from "../../components/StudyForm/StudyForm";
import { useSubmissionCreate } from "../../queries";
import { SubmissionMetadataCreate } from "../../api";
import { paths } from "../../Router";
import { defaultSubmission } from "../../data";
import { checkmark } from "ionicons/icons";

const StudyCreatePage: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const submissionCreate = useSubmissionCreate();
  const submission = useMemo(defaultSubmission, []);

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
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>New Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <StudyForm submission={submission} onSave={handleSave} />
      </IonContent>
    </IonPage>
  );
};

export default StudyCreatePage;
