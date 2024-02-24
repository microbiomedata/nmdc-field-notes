import { useSubmission } from "../queries";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
} from "@ionic/react";
import React, { useEffect } from "react";
import { SubmissionMetadata } from "../api";
import { produce } from "immer";

interface SubmissionFormProps {
  id: string;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ id }) => {
  const { query, mutation } = useSubmission(id);
  const [formData, setFormData] = React.useState<
    SubmissionMetadata | undefined
  >();
  useEffect(() => {
    setFormData(query.data);
  }, [query.data]);

  const handleSave = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    if (!formData) {
      return;
    }
    mutation.mutate(formData);
  };

  if (query.data) {
    return (
      <>
        <IonList>
          <IonItem>
            <IonInput
              type="text"
              label="Study Name"
              value={formData?.metadata_submission.studyForm.studyName}
              onIonInput={(e) =>
                setFormData(
                  produce((draft) => {
                    if (!draft) {
                      return;
                    }
                    draft.metadata_submission.studyForm.studyName =
                      e.detail.value || "";
                  }),
                )
              }
            />
          </IonItem>
        </IonList>
        <IonButton
          onClick={handleSave}
          disabled={!mutation.isPending && mutation.isPending}
        >
          {!mutation.isPending && mutation.isPending ? <IonSpinner /> : "Save"}
        </IonButton>
      </>
    );
  }

  if (query.error) {
    return <div>Error: {query.error.message}</div>;
  }

  return <div>Loading...</div>;
};

export default SubmissionForm;
