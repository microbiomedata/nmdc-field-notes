import React, { useEffect, useMemo } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
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

interface SamplePageParams {
  submissionId: string;
  sampleIndex: string;
}

const SamplePage: React.FC = () => {
  const schema = useSubmissionSchema();
  const [modalSlot, setModalSlot] = React.useState<SlotDefinition | null>(null);
  const [validationResults, setValidationResults] =
    React.useState<ValidationResults>();
  const { submissionId, sampleIndex } = useParams<SamplePageParams>();
  const { query: submission, updateMutation } = useSubmission(submissionId);
  const sample = useMemo(
    () => getSubmissionSample(submission.data, parseInt(sampleIndex)),
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
      const sample = getSubmissionSample(draft, parseInt(sampleIndex));
      if (sample) {
        if (value) {
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
          draft[parseInt(sampleIndex)][modalSlot.name] = result;
        } else {
          delete draft[parseInt(sampleIndex)][modalSlot.name];
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
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {schema.data && (
          <>
            <SampleView
              onSlotClick={handleSlotClick}
              sample={sample}
              schema={schema.data}
              schemaClass={schemaClassName}
              validationResults={validationResults?.[parseInt(sampleIndex)]}
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
                  ? validationResults?.[parseInt(sampleIndex)]?.[modalSlot.name]
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
