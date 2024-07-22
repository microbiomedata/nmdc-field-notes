import React, { useEffect, useMemo } from "react";
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
import { getSubmissionSamples } from "../../utils";
import paths from "../../paths";
import NoneOr from "../NoneOr/NoneOr";
import { useTour } from "@reactour/tour";

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

  // Get the function that we can call to start the tour.
  const { setIsOpen } = useTour();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <IonListHeader>
        <IonLabel>Studies</IonLabel>
        <IonButton routerLink={paths.studyCreate} data-tour-step={2}>
          New
        </IonButton>
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
        <IonText color="medium" className="ion-padding" data-tour-step={1}>
          No studies yet
        </IonText>
      ) : (
        <>
          <IonList>
            {concatenatedSubmissions.map((submission) => (
              <IonItem
                key={submission.id}
                routerLink={paths.studyView(submission.id)}
              >
                <IonLabel>
                  <h3>
                    <NoneOr placeholder="No study name">
                      {submission.metadata_submission.studyForm.studyName}
                    </NoneOr>
                  </h3>
                  <p>
                    <NoneOr placeholder="No template selected">
                      {submission.metadata_submission.templates[0]}
                    </NoneOr>
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
