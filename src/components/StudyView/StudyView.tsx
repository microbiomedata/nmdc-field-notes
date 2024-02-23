import React from "react";
import { useSubmission } from "../../queries";
import {
  IonButton,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonProgressBar,
} from "@ionic/react";
import SectionHeader from "../SectionHeader/SectionHeader";
import { getSubmissionSamples } from "../../utils";
import { paths } from "../../Router";

const COLLAPSED_SAMPLE_COUNT = 5;

interface StudyViewProps {
  submissionId: string;
}

const StudyView: React.FC<StudyViewProps> = ({ submissionId }) => {
  const [showAllSamples, setShowAllSamples] = React.useState(false);
  const { query: submission } = useSubmission(submissionId);
  const samples = getSubmissionSamples(submission.data);

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
                <p>{submission.data.metadata_submission.studyForm.studyName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Description</h3>
                <p>
                  {submission.data.metadata_submission.studyForm.description}
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Notes</h3>
                <p>{submission.data.metadata_submission.studyForm.notes}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <SectionHeader>Principal Investigator</SectionHeader>
          <IonList className="ion-padding-bottom">
            <IonItem>
              <IonLabel>
                <h3>Name</h3>
                <p>{submission.data.metadata_submission.studyForm.piName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Email</h3>
                <p>{submission.data.metadata_submission.studyForm.piEmail}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>ORCID iD</h3>
                <p>{submission.data.metadata_submission.studyForm.piOrcid}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <IonListHeader>
            <IonLabel>Samples {samples && <>({samples.length})</>}</IonLabel>
            <IonButton routerLink={paths.sampleCreate(submissionId)}>
              New
            </IonButton>
          </IonListHeader>
          <IonChip className="ion-margin-horizontal">
            Template: {submission.data.metadata_submission.templates[0]}
          </IonChip>
          <div className="ion-padding-bottom">
            <IonList>
              {samples
                .slice(0, showAllSamples ? undefined : COLLAPSED_SAMPLE_COUNT)
                .map((sample, index) => (
                  <IonItem
                    key={index}
                    routerLink={paths.sample(submissionId, index)}
                  >
                    <IonLabel>
                      <h3>{sample.samp_name}</h3>
                    </IonLabel>
                  </IonItem>
                ))}
            </IonList>
            {samples.length > COLLAPSED_SAMPLE_COUNT && (
              <IonButton
                expand="block"
                fill="clear"
                onClick={() => setShowAllSamples(!showAllSamples)}
              >
                {showAllSamples ? "Show Less" : "Show All"}
              </IonButton>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default StudyView;
