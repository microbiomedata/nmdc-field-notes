import React, { useMemo } from "react";
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
import SlotSelectorModal from "../SlotSelectorModal/SlotSelectorModal";
import { TEMPLATES } from "../../api";
import Pluralize from "../Pluralize/Pluralize";

interface TemplateVisibleSlots {
  template: string;
  templateDisplay: string;
  visibleSlots: string[] | undefined;
}

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
  const [modalTemplateVisibleSlots, setModalTemplateVisibleSlots] =
    React.useState<TemplateVisibleSlots | undefined>(undefined);

  const templateVisibleSlots = useMemo(() => {
    const fieldVisibilityInfo: TemplateVisibleSlots[] = [];
    if (submission.data) {
      const packageName = submission.data.metadata_submission.packageName;
      const template = TEMPLATES[packageName];
      fieldVisibilityInfo.push({
        template: packageName,
        templateDisplay: template.displayName,
        visibleSlots:
          submission.data.field_notes_metadata?.fieldVisibility?.[packageName],
      });
    }
    return fieldVisibilityInfo;
  }, [submission.data]);

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

  const handleSlotSelectorSave = (selectedSlots: string[]) => {
    if (!submission.data) {
      return;
    }
    const updatedSubmission = produce(submission.data, (draft) => {
      if (!draft.field_notes_metadata) {
        draft.field_notes_metadata = {};
      }
      if (!draft.field_notes_metadata.fieldVisibility) {
        draft.field_notes_metadata.fieldVisibility = {};
      }
      draft.field_notes_metadata.fieldVisibility[
        modalTemplateVisibleSlots!.template
      ] = selectedSlots;
    });
    updateMutation.mutate(updatedSubmission, {
      onSuccess: () => {
        setModalTemplateVisibleSlots(undefined);
      },
    });
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

          <SectionHeader>Templates</SectionHeader>
          <IonList className="ion-padding-bottom">
            {templateVisibleSlots.map((item) => (
              <IonItem
                key={item.template}
                onClick={() => setModalTemplateVisibleSlots(item)}
              >
                <IonLabel>
                  <h3>{item.templateDisplay}</h3>
                  <p>
                    {item.visibleSlots === undefined ? (
                      "Not customized"
                    ) : (
                      <>
                        <Pluralize
                          count={item.visibleSlots.length}
                          singular={"field"}
                          showCount
                        />{" "}
                        chosen
                      </>
                    )}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
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

          <SlotSelectorModal
            onSave={handleSlotSelectorSave}
            onDismiss={() => setModalTemplateVisibleSlots(undefined)}
            isOpen={modalTemplateVisibleSlots !== undefined}
            templateName={modalTemplateVisibleSlots?.template}
            defaultSelectedSlots={modalTemplateVisibleSlots?.visibleSlots}
          />
        </>
      )}
    </>
  );
};

export default StudyView;
