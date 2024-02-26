import React, { useMemo } from "react";
import { useSubmissionList } from "../../queries";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonProgressBar,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { SubmissionMetadata } from "../../api";
import Pluralize from "../Pluralize/Pluralize";
import { PATHS } from "../../Router";

const getSubmissionSamples = (submission: SubmissionMetadata) => {
  const environmentalPackageName =
    submission.metadata_submission.templates[0].replaceAll("-", "_");
  const sampleDataField = `${environmentalPackageName}_data`;
  return submission.metadata_submission.sampleData[sampleDataField] || [];
};

const StudyList: React.FC = () => {
  const submissionList = useSubmissionList();
  const concatenatedSubmissions = useMemo(() => {
    if (!submissionList.data) {
      return [];
    }
    return submissionList.data.pages.reduce(
      (acc, page) => acc.concat(page.results),
      [] as SubmissionMetadata[],
    );
  }, [submissionList.data]);

  return (
    <>
      <IonListHeader>
        <IonLabel>Studies</IonLabel>
        <IonButton routerLink={PATHS.STUDY_CREATE_PAGE}>New</IonButton>
      </IonListHeader>

      <IonProgressBar
        type="indeterminate"
        style={{
          visibility:
            submissionList.isFetching || submissionList.isLoading
              ? "visible"
              : "hidden",
        }}
      />

      {concatenatedSubmissions.length === 0 ? (
        <IonText color="medium" className="ion-padding">
          No studies yet
        </IonText>
      ) : (
        <>
          <IonList lines="full">
            {concatenatedSubmissions.map((submission) => (
              <IonItem
                key={submission.id}
                routerLink={PATHS.STUDY_VIEW_PAGE.replace(":id", submission.id)}
              >
                <IonLabel>
                  <h3>
                    {submission.metadata_submission.studyForm.studyName || (
                      <IonText color="medium">(No study name)</IonText>
                    )}
                  </h3>
                  <p>
                    {submission.metadata_submission.templates[0] ||
                      "No template selected"}
                    {" • "}
                    <Pluralize
                      count={getSubmissionSamples(submission).length}
                      singular="Sample"
                      showCount
                    />
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>

          {submissionList.hasNextPage && (
            <IonButton
              fill="clear"
              expand="block"
              className="ion-padding-horizontal ion-padding-bottom"
              disabled={submissionList.isFetching}
              onClick={() => submissionList.fetchNextPage()}
            >
              {submissionList.isFetchingNextPage ? <IonSpinner /> : "Load More"}
            </IonButton>
          )}
        </>
      )}
    </>
  );
};

export default StudyList;
