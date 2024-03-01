import React from "react";
import { useSubmission } from "../../queries";
import { IonItem, IonLabel, IonList, IonProgressBar } from "@ionic/react";
import SectionHeader from "../SectionHeader/SectionHeader";
import NoneOr from "../NoneOr/NoneOr";
import SampleList from "../SampleList/SampleList";

interface StudyViewProps {
  submissionId: string;
}

const StudyView: React.FC<StudyViewProps> = ({ submissionId }) => {
  const { query: submission } = useSubmission(submissionId);

  return (
    <>
      <IonProgressBar
        type="indeterminate"
        style={{
          visibility:
            submission.isFetching || submission.isLoading
              ? "visible"
              : "hidden",
        }}
      />

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

          <SampleList submission={submission.data} />
        </>
      )}
    </>
  );
};

export default StudyView;
