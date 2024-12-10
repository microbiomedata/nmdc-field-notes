import React, { useEffect, useMemo } from "react";
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
import {
  getSubmissionSamples,
  getSubmissionSamplesForTemplate,
  getSubmissionTemplates,
} from "../../utils";
import { produce } from "immer";
import paths from "../../paths";
import { useNetworkStatus } from "../../NetworkStatus";
import QueryErrorBanner from "../QueryErrorBanner/QueryErrorBanner";
import MutationErrorBanner from "../MutationErrorBanner/MutationErrorBanner";
import SlotSelectorModal from "../SlotSelectorModal/SlotSelectorModal";
import { SlotName, TemplateName, TEMPLATES } from "../../api";
import Pluralize from "../Pluralize/Pluralize";

interface TemplateVisibleSlots {
  template: TemplateName;
  templateDisplay: string;
  visibleSlots: SlotName[] | undefined;
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
      const templates = getSubmissionTemplates(submission.data);
      templates.forEach((templateName) => {
        const template = TEMPLATES[templateName];
        fieldVisibilityInfo.push({
          template: templateName,
          templateDisplay: template.displayName,
          visibleSlots:
            submission.data.field_notes_metadata?.fieldVisibility?.[
              templateName
            ],
        });
      });
    }
    return fieldVisibilityInfo;
  }, [submission.data]);

  useEffect(() => {
    // If the slot selector is not already open, iterate through the study's templates. If one of
    // them has no visible slot information (this could be because it is a brand-new study or
    // because it was created via the submission portal and this is the first time opening it in the
    // app), open the slot selector for that template.
    if (modalTemplateVisibleSlots !== undefined) {
      return;
    }
    for (const item of templateVisibleSlots) {
      if (item.visibleSlots === undefined) {
        setModalTemplateVisibleSlots(item);
        return;
      }
    }
  }, [modalTemplateVisibleSlots, templateVisibleSlots]);

  const handleSampleCreate = async (template: TemplateName) => {
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
      const templateSamples = samples[template];
      if (!templateSamples) {
        samples[template] = [{}];
      } else {
        templateSamples.push({});
      }
    });
    updateMutation.mutate(updatedSubmission, {
      onSuccess: (result) => {
        const samples = getSubmissionSamplesForTemplate(result, template);
        router.push(
          paths.sample(submissionId, template, samples.length - 1),
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
                        selected
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

          {/* TODO: lock/unlock submission when opening/closing the modal */}
          <SlotSelectorModal
            allowDismiss={modalTemplateVisibleSlots?.visibleSlots !== undefined}
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
