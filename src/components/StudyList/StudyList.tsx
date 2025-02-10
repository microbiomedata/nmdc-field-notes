import React, { useMemo } from "react";
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
import { getSubmissionSamplesCount, getSubmissionTemplates } from "../../utils";
import paths from "../../paths";
import NoneOr from "../NoneOr/NoneOr";
import QueryErrorBanner from "../QueryErrorBanner/QueryErrorBanner";
import { StepType } from "@reactour/tour";
import { useAppTour } from "../AppTourProvider/hooks";
import { TourId } from "../AppTourProvider/AppTourProvider";
import SectionHeader from "../SectionHeader/SectionHeader";

import styles from "./StudyList.module.css";

// Make steps for the tour.
// Reference: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
const steps: Array<StepType> = [
  {
    selector: `[data-tour="${TourId.StudyList}-1"]`,
    content: "You can tap here to create a new study.",
  },
  {
    selector: `[data-tour="${TourId.StudyList}-2"]`,
    content:
      "Here is where you'll see any studies created through the app or the NMDC Submission Portal. You can tap on a study to edit it or update its samples.",
    padding: { mask: [40, 0, 12, 0] }, // increases vertical padding so "Studies" header is also highlighted and the body has some margin below it
  },
];

const StudyList: React.FC = () => {
  useAppTour(TourId.StudyList, steps);

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
        <IonLabel className={styles.ionLabel}>
          <SectionHeader className={styles.sectionHeaderWithinListHeader}>
            Studies
          </SectionHeader>
        </IonLabel>
        <IonButton
          routerLink={paths.studyCreate}
          data-tour={`${TourId.StudyList}-1`}
        >
          New
        </IonButton>
      </IonListHeader>

      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      <span data-tour={`${TourId.StudyList}-2`}>
        {submissionList.data &&
          (concatenatedSubmissions.length === 0 ? (
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
                          {getSubmissionTemplates(submission).join(", ")}
                        </NoneOr>
                        {" • "}
                        <Pluralize
                          count={getSubmissionSamplesCount(submission)}
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
      </span>
    </>
  );
};

export default StudyList;
