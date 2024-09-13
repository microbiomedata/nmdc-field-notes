import React, { useCallback, useEffect, useMemo } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  useIonAlert,
  useIonRouter,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router";
import paths from "../../paths";
import { useSubmission, useSubmissionSchema } from "../../queries";
import { getSubmissionSample, getSubmissionSamples } from "../../utils";
import { SampleData, SampleDataValue, TEMPLATES } from "../../api";
import SampleView from "../../components/SampleView/SampleView";
import { SlotDefinition, SlotDefinitionName } from "../../linkml-metamodel";
import SampleSlotEditModal from "../../components/SampleSlotEditModal/SampleSlotEditModal";
import { produce } from "immer";
import Validator, { ValidationResults } from "../../Validator";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import Banner from "../../components/Banner/Banner";
import { useNetworkStatus } from "../../NetworkStatus";
import { useIsSubmissionEditable } from "../../useIsSubmissionEditable";
import MutationErrorBanner from "../../components/MutationErrorBanner/MutationErrorBanner";

interface SamplePageParams {
  submissionId: string;
  sampleIndex: string;
}

const SamplePage: React.FC = () => {
  const schema = useSubmissionSchema();
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();
  const [modalSlot, setModalSlot] = React.useState<SlotDefinition | null>(null);
  const [validationResults, setValidationResults] =
    React.useState<ValidationResults>();
  const { submissionId, sampleIndex } = useParams<SamplePageParams>();
  const sampleIndexInt = parseInt(sampleIndex);
  const {
    query: submission,
    updateMutation,
    lockMutation,
    unlockMutation,
  } = useSubmission(submissionId);
  const sample = useMemo(
    () => getSubmissionSample(submission.data, sampleIndexInt),
    [submission.data, sampleIndexInt],
  );
  const { isOnline } = useNetworkStatus();

  const getSlotValue = useCallback(
    (slotName: SlotDefinitionName) => {
      return sample?.[slotName];
    },
    [sample],
  );

  const packageName = submission.data?.metadata_submission.packageName;
  const schemaClassName = packageName && TEMPLATES[packageName].schemaClass;
  const validator = useMemo(() => {
    if (!schema.data?.schema || !schemaClassName) {
      return null;
    }
    const validator = new Validator(schema.data.schema);
    validator.useTargetClass(schemaClassName);
    return validator;
  }, [schema.data?.schema, schemaClassName]);

  const loggedInUserCanEdit = useIsSubmissionEditable(submission.data);

  const handleSlotClick = (slot: SlotDefinition) => {
    setModalSlot(slot);
  };

  const handleSave = (values: SampleData) => {
    if (!modalSlot || !submission.data) {
      return;
    }
    const updatedSubmission = produce(submission.data, (draft) => {
      const sample = getSubmissionSample(draft, sampleIndexInt);
      if (sample) {
        for (const [key, value] of Object.entries(values)) {
          if (value != null) {
            sample[key] = value;
          } else {
            delete sample[key];
          }
        }
      }
    });
    updateMutation.mutate(updatedSubmission, {
      onSuccess: () => setModalSlot(null),
    });
    if (!isOnline) {
      // If we're offline, the `updateMutation` will stay in a paused state and not fire `onSuccess`
      // until we go back online. So we need to manually close the modal here.
      setModalSlot(null);
    }
  };

  const handleModalValueChange = (value: SampleDataValue) => {
    if (!modalSlot || !validator) {
      return;
    }
    // When the value in the modal changes do a partial revalidation
    const result = validator.getValidatorForSlot(modalSlot.name)(value);
    setValidationResults(
      produce((draft) => {
        if (!draft) {
          return;
        }
        if (result) {
          // If the sample previously passed validation, its index won't be
          // in `draft`. But it needs to be after this partial validation,
          // so add a spot for it now.
          if (!(sampleIndexInt in draft)) {
            draft[sampleIndexInt] = {};
          }
          draft[sampleIndexInt][modalSlot.name] = result;
        } else {
          // If the sample previously passed validation, its index won't be
          // in `draft`. Since it's still passing after this partial
          // validation, just move on.
          if (!(sampleIndexInt in draft)) {
            return;
          }
          delete draft[sampleIndexInt][modalSlot.name];
        }
      }),
    );
  };

  useIonViewWillEnter(() => {
    if (isOnline) {
      lockMutation.mutate(submissionId);
    }
  });

  useIonViewDidLeave(() => {
    if (isOnline && loggedInUserCanEdit) {
      unlockMutation.mutate(submissionId);
    }
  });

  useEffect(() => {
    if (!validator || !submission.data) {
      return;
    }
    // When the submission data updates (i.e. after saving), do a full revalidation
    const results = validator.validate(getSubmissionSamples(submission.data));
    setValidationResults(results);
  }, [validator, submission.data]);

  const handleDeleteInitiate = () => {
    presentAlert({
      header: "Delete Sample",
      message: "Are you sure you want to delete this sample?",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            if (!submission.data) {
              return;
            }
            const updatedSubmission = produce(submission.data, (draft) => {
              const samples = getSubmissionSamples(draft);
              samples.splice(sampleIndexInt, 1);
            });
            updateMutation.mutate(updatedSubmission, {
              onSuccess: () =>
                router.push(paths.studyView(submissionId), "back"),
            });
          },
        },
      ],
    });
  };

  const handleModalCancel = () => {
    setModalSlot(null);
    updateMutation.reset();
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
          <IonTitle>Sample</IonTitle>
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
              <IonItem
                button
                detail={false}
                disabled={!loggedInUserCanEdit}
                onClick={handleDeleteInitiate}
              >
                Delete Sample
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        {!lockMutation.isPending &&
          !lockMutation.isIdle &&
          !loggedInUserCanEdit && (
            <Banner color="warning">
              <IonLabel>
                Editing is disabled because this sample is currently being
                edited by{" "}
                {submission.data?.locked_by?.name || "an unknown user"}
              </IonLabel>
            </Banner>
          )}

        {!schema.data && !schema.isFetching && (
          <Banner color="danger">
            <IonLabel>
              <b>Error</b> Schema not found. Please ensure you are connected to the internet and try again.
            </IonLabel>
          </Banner>
        )}

        {schema.data && (
          <>
            <SampleView
              onSlotClick={handleSlotClick}
              packageName={packageName!}
              sample={sample}
              schema={schema.data.schema}
              validationResults={validationResults?.[sampleIndexInt]}
            />
            <SampleSlotEditModal
              defaultValue={modalSlot && sample?.[modalSlot.name]}
              disabled={!loggedInUserCanEdit}
              errorBanner={
                <MutationErrorBanner mutation={updateMutation}>
                  Error saving sample
                </MutationErrorBanner>
              }
              getSlotValue={getSlotValue}
              goldEcosystemTree={schema.data.goldEcosystemTree}
              onCancel={handleModalCancel}
              onSave={handleSave}
              onChange={handleModalValueChange}
              saving={isOnline && updateMutation.isPending}
              schema={schema.data.schema}
              slot={modalSlot}
              validationResult={
                modalSlot
                  ? validationResults?.[sampleIndexInt]?.[modalSlot.name]
                  : undefined
              }
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SamplePage;
