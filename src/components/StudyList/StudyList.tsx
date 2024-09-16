import React, {useEffect, useMemo} from "react";
import { useSubmissionList } from "../../queries";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import { SubmissionMetadata } from "../../api";
import Pluralize from "../Pluralize/Pluralize";
import { getSubmissionSamples } from "../../utils";
import paths from "../../paths";
import NoneOr from "../NoneOr/NoneOr";
import QueryErrorBanner from "../QueryErrorBanner/QueryErrorBanner";
import { StepType } from "@reactour/tour";
import { useLocalTour } from "../CustomTourProvider/hooks";
import { TourId } from "../CustomTourProvider/CustomTourProvider";

// Make steps for the tour.
// Reference: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
const steps: Array<StepType> = [
  {
    selector: `[data-tour="${TourId.StudyList}-1"]`,
    content: "Tap here to create a new study.",
  },
  {
    selector: `[data-tour="${TourId.StudyList}-2"]`,
    content: "Tap here to edit an existing study.",
    padding: { mask: [24, 0, 0, 0] }, // increases padding-top so "Studies" header is also highlighted
  },
];

const StudyList: React.FC = () => {
  useLocalTour(TourId.StudyList, steps);

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

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await submissionList.refetch();
    event.detail.complete();
  };

  return (
    <>
      <QueryErrorBanner query={submissionList}>
        Error loading studies
      </QueryErrorBanner>

      <IonListHeader>
        <IonLabel>Studies</IonLabel>
        <IonButton routerLink={paths.studyCreate} data-tour={`${TourId.StudyList}-1`}>
          New
        </IonButton>
      </IonListHeader>

      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      {submissionList.data &&
        (concatenatedSubmissions.length === 0 ? (
          <IonText
            color="medium"
            className="ion-padding"
            data-tour={"StudyList-2"}
          >
            No studies yet
          </IonText>
        ) : (
          <>
            <IonList data-tour={`${TourId.StudyList}-2`}>
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
                {submissionList.isFetchingNextPage ? (
                  <IonSpinner />
                ) : (
                  "Load More"
                )}
              </IonButton>
            )}
          </>
        ))}
    </>
  );
};

export default StudyList;
