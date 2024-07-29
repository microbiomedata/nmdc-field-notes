import React, { useMemo } from "react";
import { useSubmissionList } from "../../queries";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { SubmissionMetadata } from "../../api";
import Pluralize from "../Pluralize/Pluralize";
import { getSubmissionSamples } from "../../utils";
import paths from "../../paths";
import NoneOr from "../NoneOr/NoneOr";

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
        <IonButton routerLink={paths.studyCreate}>New</IonButton>
      </IonListHeader>

      {concatenatedSubmissions.length === 0 ? (
        <IonText color="medium" className="ion-padding">
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
