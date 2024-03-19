import React, { useMemo } from "react";
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
import { getSubmissionSample } from "../../utils";
import { TEMPLATES } from "../../api";
import SampleView from "../../components/SampleView/SampleView";
import { SlotDefinition } from "../../linkml-metamodel";
import SampleSlotEditModal from "../../components/SampleSlotEditModal/SampleSlotEditModal";
import { produce } from "immer";

interface SamplePageParams {
  submissionId: string;
  sampleIndex: string;
}

const SamplePage: React.FC = () => {
  const schema = useSubmissionSchema();
  const [modalSlot, setModalSlot] = React.useState<SlotDefinition | null>(null);
  const { submissionId, sampleIndex } = useParams<SamplePageParams>();
  const { query: submission, updateMutation } = useSubmission(submissionId);
  const sample = useMemo(
    () => getSubmissionSample(submission.data, parseInt(sampleIndex)),
    [submission.data, sampleIndex],
  );

  const packageName = submission.data?.metadata_submission.packageName;
  const schemaClassName = packageName && TEMPLATES[packageName].schemaClass;

  const handleSlotClick = (slot: SlotDefinition) => {
    setModalSlot(slot);
  };

  const handleSave = (value: Nullable<string>) => {
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
            />
            <SampleSlotEditModal
              defaultValue={modalSlot && sample?.[modalSlot?.name]}
              onCancel={() => setModalSlot(null)}
              onSave={handleSave}
              saving={updateMutation.isPending}
              schema={schema.data}
              slot={modalSlot}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SamplePage;
