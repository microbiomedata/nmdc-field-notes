import React, { useEffect, useMemo } from "react";
import {
  AlertInput,
  IonButton,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSearchbar,
  SearchbarInputEventDetail,
  useIonAlert,
} from "@ionic/react";
import paths from "../../paths";
import { search as searchIcon } from "ionicons/icons";
import NoneOr from "../NoneOr/NoneOr";
import { IndexedSampleData, SubmissionMetadata, TemplateName } from "../../api";
import { IonSearchbarCustomEvent } from "@ionic/core/dist/types/components";
import { useMiniSearch } from "react-minisearch";
import { getSubmissionTemplates, getSubmissionSamples } from "../../utils";
import Banner from "../Banner/Banner";
import { StepType } from "@reactour/tour";
import { useAppTour } from "../AppTourProvider/hooks";
import { TourId } from "../AppTourProvider/AppTourProvider";
import SectionHeader from "../SectionHeader/SectionHeader";

import styles from "./SampleList.module.css";

// Make steps for the tour.
const steps: Array<StepType> = [
  {
    selector: `[data-tour="${TourId.SampleList}-1"]`,
    content: "You can tap here to add samples to the study.",
  },
];

interface SampleListProps {
  submission: SubmissionMetadata;
  collapsedSize?: number;
  onSampleCreate: (template: TemplateName) => void;
  sampleCreateFailureMessage?: string;
}

const SampleList: React.FC<SampleListProps> = ({
  submission,
  collapsedSize = 5,
  onSampleCreate,
  sampleCreateFailureMessage,
}) => {
  useAppTour(TourId.SampleList, steps);

  const searchElement = React.useRef<HTMLIonSearchbarElement>(null);

  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string | null>();
  const [templateFilter, setTemplateFilter] = React.useState<string | null>(
    null,
  );

  const [presentAlert] = useIonAlert();

  // Initialize the search index with no documents. The search index will be updated whenever the
  // submission samples change.
  const {
    search,
    searchResults,
    removeAll: searchIndexRemoveAll,
    addAll: searchIndexAddAll,
  } = useMiniSearch([] as IndexedSampleData[], {
    fields: ["samp_name"],
    idField: "_flatIndex",
    searchOptions: {
      prefix: true,
      combineWith: "AND",
    },
  });

  const samples = useMemo(() => {
    const samplesMap = getSubmissionSamples(submission);
    const flattenedSamples: IndexedSampleData[] = [];
    // Here is where we flatten out the {template: [samples]} structure into a single array for
    // display. While flattening, we need to keep track of which template the sample was associated
    // with (`_template`) and the sample's index within that template's sample array
    // (`templateIndex`). These are used to construct the router link to the sample page. We also
    // need a unique identifier for each sample (`_flatIndex`) so that we can use it as the key in
    // the list of samples and in the search index.
    let flatIndex = 0;
    Object.entries(samplesMap).forEach(([template, samples]) => {
      const templateName = template as TemplateName;
      samples.forEach((sample, index) => {
        flattenedSamples.push({
          ...sample,
          _flatIndex: flatIndex++,
          _templateIndex: index,
          _template: templateName,
        });
      });
    });
    return flattenedSamples.reverse();
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

  const handleNewClick = () => {
    const templates = getSubmissionTemplates(submission);
    if (templates.length > 1) {
      void presentAlert({
        header: "Select Template",
        message: "Select the template for the new sample.",
        inputs: templates.map(
          (template) =>
            ({
              label: template,
              value: template,
              type: "radio",
            }) as AlertInput,
        ),
        buttons: [
          "Cancel",
          {
            text: "OK",
            handler: (template) => {
              onSampleCreate(template);
            },
          },
        ],
      });
    } else {
      onSampleCreate(templates[0]);
    }
  };

  const displaySamples = (searchTerm ? searchResults || [] : samples).filter(
    (sample) => templateFilter == null || sample._template == templateFilter,
  );

  return (
    <>
      <IonListHeader>
        <IonLabel>
          <SectionHeader className={styles.sectionHeaderWithinListHeader}>
            Samples {samples && <>({samples.length})</>}
          </SectionHeader>
        </IonLabel>
        <IonButton
          onClick={handleNewClick}
          data-tour={`${TourId.SampleList}-1`}
        >
          New
        </IonButton>
      </IonListHeader>

      {sampleCreateFailureMessage && (
        <Banner color="warning">
          <IonLabel>{sampleCreateFailureMessage}</IonLabel>
        </Banner>
      )}

      <div className={isSearchVisible ? "ion-hide" : ""}>
        <div className={styles.searchAndFilterContainer}>
          <div className={styles.filterContainer}>
            {getSubmissionTemplates(submission).map((template) => (
              <IonChip
                key={template}
                outline={templateFilter == null || template != templateFilter}
                onClick={() =>
                  setTemplateFilter(
                    template == templateFilter ? null : template,
                  )
                }
              >
                Template: {template}
              </IonChip>
            ))}
          </div>
          <div className={styles.searchButton}>
            <IonButton
              title="show sample search"
              size="small"
              fill="clear"
              onClick={() => setIsSearchVisible(true)}
            >
              <IonIcon icon={searchIcon} slot="icon-only"></IonIcon>
            </IonButton>
          </div>
        </div>
      </div>

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
                  key={result._flatIndex}
                  routerLink={paths.sample(
                    submission.id,
                    result._template,
                    result._templateIndex,
                  )}
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
