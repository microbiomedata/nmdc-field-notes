import React from "react";
import { useSubmission } from "../../queries";
import {
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  useIonRouter,
} from "@ionic/react";
import SectionHeader from "../SectionHeader/SectionHeader";
import NoneOr from "../NoneOr/NoneOr";
import SampleList from "../SampleList/SampleList";
import { getSubmissionSamples } from "../../utils";
import { produce } from "immer";
import paths from "../../paths";

interface StudyViewProps {
  submissionId: string;
}

const StudyView: React.FC<StudyViewProps> = ({ submissionId }) => {
  const router = useIonRouter();
  const {
    query: submission,
    updateMutation,
    lockMutation,
  } = useSubmission(submissionId);

  const handleSampleCreate = async () => {
    if (!submission.data) {
      return;
    }

    try {
      await lockMutation.mutateAsync(submissionId);
    } catch {
      return;
    }

    const updatedSubmission = produce(submission.data, (draft) => {
      const samples = getSubmissionSamples(draft, {
        createSampleDataFieldIfMissing: true,
      });
      samples.push({});
    });
    updateMutation.mutate(updatedSubmission, {
      onSuccess: (result) => {
        const samples = getSubmissionSamples(result);
        router.push(
          paths.sample(submissionId, samples.length - 1),
          "forward",
          "push",
        );
      },
    });
  };

  return (
    <>
      {submission.data && (
        <>
          <IonList className="ion-padding-bottom">
            <IonItem>
              <IonLabel>
                <h3>Name</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.studyName}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Description</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.description}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Notes</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.notes}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
          </IonList>

          <SectionHeader>Principal Investigator</SectionHeader>
          <IonList className="ion-padding-bottom">
            <IonItem>
              <IonLabel>
                <h3>Name</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.piName}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Email</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.piEmail}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>ORCID iD</h3>
                <p>
                  <NoneOr>
                    {submission.data.metadata_submission.studyForm.piOrcid}
                  </NoneOr>
                </p>
              </IonLabel>
            </IonItem>
          </IonList>

          <SampleList
            submission={submission.data}
            onSampleCreate={handleSampleCreate}
            sampleCreateFailureMessage={
              lockMutation.isError
                ? `Cannot create new sample because this study is currently being edited by ${submission.data.locked_by?.name || "an unknown user"}`
                : undefined
            }
          />
        </>
      )}
    </>
  );
};

export default StudyView;
