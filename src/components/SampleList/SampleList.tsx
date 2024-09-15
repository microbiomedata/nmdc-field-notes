import React, { useEffect, useMemo } from "react";
import {
  IonButton,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRow,
  IonSearchbar,
  SearchbarInputEventDetail,
} from "@ionic/react";
import paths from "../../paths";
import { search as searchIcon } from "ionicons/icons";
import NoneOr from "../NoneOr/NoneOr";
import { IndexedSampleData, SubmissionMetadata } from "../../api";
import { IonSearchbarCustomEvent } from "@ionic/core/dist/types/components";
import { useMiniSearch } from "react-minisearch";
import { getSubmissionSamples } from "../../utils";
import { produce } from "immer";
import Banner from "../Banner/Banner";
import { StepType } from "@reactour/tour";
import { useLocalTour } from "../CustomTourProvider/hooks";

// Make steps for the tour.
const steps: Array<StepType> = [
  {
    selector: "[data-tour='SampleList-1']",
    content: "Tap here to add samples to the study.",
  },
];

interface SampleListProps {
  submission: SubmissionMetadata;
  collapsedSize?: number;
  onSampleCreate: () => void;
  sampleCreateFailureMessage?: string;
}

const SampleList: React.FC<SampleListProps> = ({
  submission,
  collapsedSize = 5,
  onSampleCreate,
  sampleCreateFailureMessage,
}) => {
  useLocalTour(steps);

  const searchElement = React.useRef<HTMLIonSearchbarElement>(null);

  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string | null>();

  // Initialize the search index with no documents. The search index will be updated whenever the
  // submission samples change.
  const {
    search,
    searchResults,
    removeAll: searchIndexRemoveAll,
    addAll: searchIndexAddAll,
  } = useMiniSearch([] as IndexedSampleData[], {
    fields: ["samp_name"],
    idField: "_index",
    searchOptions: {
      prefix: true,
      combineWith: "AND",
    },
  });

  const samples = useMemo(() => {
    return produce(
      getSubmissionSamples(submission) as IndexedSampleData[],
      (draft) => {
        // Because the submission portal backend needs to be tolerant of storing "invalid" data, some
        // samples could essentially be empty. Therefore, there are no existing fields we can treat as a
        // key (or persistent identifier). The samples are essentially identified by their position in the
        // array. However, because the SampleList component allows the user to filter samples, we need to
        // keep track of the original index of each sample.
        draft.forEach((sample, index) => {
          sample["_index"] = index;
        });
        // Reverse so that the most recent samples are shown first
        draft.reverse();
      },
    );
  }, [submission]);

  // Whenever the samples change, update the search index.
  // Instead of attempting to diff the existing index with the new samples, we just remove all and
  // add all. This should be fine because the index is fairly small and won't change too often.
  // See also: https://github.com/lucaong/react-minisearch/issues/43#issuecomment-2109657251
  useEffect(() => {
    searchIndexRemoveAll();
    searchIndexAddAll(samples);
  }, [samples, searchIndexRemoveAll, searchIndexAddAll]);

  // Whenever the search field changes from hidden to visible, focus on it.
  // This is done in a useEffect so that it happens after the searchbox is rendered.
  useEffect(() => {
    if (isSearchVisible) {
      searchElement.current?.setFocus();
    }
  }, [isSearchVisible]);

  const handleSearchInput = (
    event: IonSearchbarCustomEvent<SearchbarInputEventDetail>,
  ) => {
    setSearchTerm(event.target.value);
    if (event.detail.value) {
      search(event.detail.value);
    }
  };

  const handleSearchCancel = () => {
    setSearchTerm(null);
    setIsSearchVisible(false);
  };

  const displaySamples = searchTerm ? searchResults || [] : samples;

  return (
    <>
      <IonListHeader>
        <IonLabel>Samples {samples && <>({samples.length})</>}</IonLabel>
        <IonButton onClick={onSampleCreate} data-tour={"SampleList-1"}>
          New
        </IonButton>
      </IonListHeader>

      {sampleCreateFailureMessage && (
        <Banner color="warning">
          <IonLabel>{sampleCreateFailureMessage}</IonLabel>
        </Banner>
      )}

      <IonGrid className={isSearchVisible ? "ion-hide" : ""}>
        <IonRow class="ion-justify-content-between">
          <IonCol size="auto">
            {submission.metadata_submission.templates.length > 0 && (
              <IonChip outline>
                Template: {submission.metadata_submission.templates[0]}
              </IonChip>
            )}
          </IonCol>
          <IonCol size="auto">
            <IonButton
              title="show sample search"
              size="small"
              fill="clear"
              onClick={() => setIsSearchVisible(true)}
            >
              <IonIcon icon={searchIcon} slot="icon-only"></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonSearchbar
        title="sample search"
        showCancelButton="always"
        debounce={200}
        className={isSearchVisible ? "" : "ion-hide"}
        onIonInput={handleSearchInput}
        onIonCancel={handleSearchCancel}
        ref={searchElement}
      />

      <div className="ion-padding-bottom">
        {displaySamples.length > 0 && (
          <IonList>
            {displaySamples
              .slice(0, isCollapsed ? collapsedSize : undefined)
              .map((result) => (
                <IonItem
                  key={result._index}
                  routerLink={paths.sample(submission.id, result._index)}
                >
                  <IonLabel>
                    <h3>
                      <NoneOr placeholder="No sample name">
                        {result.samp_name}
                      </NoneOr>
                    </h3>
                  </IonLabel>
                </IonItem>
              ))}
          </IonList>
        )}

        {displaySamples.length > collapsedSize && (
          <IonButton
            expand="block"
            fill="clear"
            onClick={() => setIsCollapsed((previous) => !previous)}
          >
            {isCollapsed ? "Show All" : "Show Less"}
          </IonButton>
        )}

        {displaySamples.length === 0 && (
          <div className="ion-text-center">
            <IonNote color="medium" className="ion-padding">
              <i>{searchTerm ? "No samples match search" : "No samples yet"}</i>
            </IonNote>
          </div>
        )}
      </div>
    </>
  );
};

export default SampleList;
