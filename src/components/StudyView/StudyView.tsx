import React from "react";
import { useSubmission } from "../../queries";
import {
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonRouter,
} from "@ionic/react";
import SectionHeader from "../SectionHeader/SectionHeader";
import NoneOr from "../NoneOr/NoneOr";
import SampleList from "../SampleList/SampleList";
import { getSubmissionSamples } from "../../utils";
import { produce } from "immer";
import paths from "../../paths";
import { useNetworkStatus } from "../../NetworkStatus";
import QueryErrorBanner from "../QueryErrorBanner/QueryErrorBanner";
import MutationErrorBanner from "../MutationErrorBanner/MutationErrorBanner";

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
  const { isOnline } = useNetworkStatus();

  const handleSampleCreate = async () => {
    if (!submission.data) {
      return;
    }

    if (isOnline) {
      try {
        await lockMutation.mutateAsync(submissionId);
      } catch {
        return;
      }
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

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await submission.refetch();
    event.detail.complete();
  };

  return (
    <>
      <QueryErrorBanner query={submission}>
        Error loading study
      </QueryErrorBanner>
      <MutationErrorBanner mutation={updateMutation}>
        Error adding sample
      </MutationErrorBanner>

      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

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
