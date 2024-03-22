import React, { useEffect, useMemo } from "react";
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
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { useParams } from "react-router";
import { paths } from "../../Router";
import { useSubmission, useSubmissionSchema } from "../../queries";
import { getSubmissionSample, getSubmissionSamples } from "../../utils";
import { SampleDataValue, TEMPLATES } from "../../api";
import SampleView from "../../components/SampleView/SampleView";
import { SlotDefinition } from "../../linkml-metamodel";
import SampleSlotEditModal from "../../components/SampleSlotEditModal/SampleSlotEditModal";
import { produce } from "immer";
import Validator, { ValidationResults } from "../../Validator";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";

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
  const { query: submission, updateMutation } = useSubmission(submissionId);
  const sample = useMemo(
    () => getSubmissionSample(submission.data, sampleIndexInt),
    [submission.data, sampleIndex],
  );

  const packageName = submission.data?.metadata_submission.packageName;
  const schemaClassName = packageName && TEMPLATES[packageName].schemaClass;
  const validator = useMemo(() => {
    if (!schema.data || !schemaClassName) {
      return null;
    }
    const validator = new Validator(schema.data);
    validator.useTargetClass(schemaClassName);
    return validator;
  }, [schema.data, schemaClassName]);

  const handleSlotClick = (slot: SlotDefinition) => {
    setModalSlot(slot);
  };

  const handleSave = (value: SampleDataValue) => {
    if (!modalSlot || !submission.data) {
      return;
    }
    const updatedSubmission = produce(submission.data, (draft) => {
      const sample = getSubmissionSample(draft, sampleIndexInt);
      if (sample) {
        if (value != null) {
          sample[modalSlot.name] = value;
        } else {
          delete sample[modalSlot.name];
        }
      }
    });
    updateMutation.mutate(updatedSubmission, {
      onSuccess: () => setModalSlot(null),
    });
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
        </IonToolbar>
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
                Delete Sample
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
        {schema.data && (
          <>
            <SampleView
              onSlotClick={handleSlotClick}
              sample={sample}
              schema={schema.data}
              schemaClass={schemaClassName}
              validationResults={validationResults?.[sampleIndexInt]}
            />
            <SampleSlotEditModal
              defaultValue={modalSlot && sample?.[modalSlot.name]}
              onCancel={() => setModalSlot(null)}
              onSave={handleSave}
              onChange={handleModalValueChange}
              saving={updateMutation.isPending}
              schema={schema.data}
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
