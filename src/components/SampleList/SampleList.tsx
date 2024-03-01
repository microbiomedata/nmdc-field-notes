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
import { paths } from "../../Router";
import { search as searchIcon } from "ionicons/icons";
import NoneOr from "../NoneOr/NoneOr";
import { SubmissionMetadata } from "../../api";
import { IonSearchbarCustomEvent } from "@ionic/core/dist/types/components";
import { useMiniSearch } from "react-minisearch";
import { getSubmissionSamples } from "../../utils";

interface SampleListProps {
  submission: SubmissionMetadata;
  collapsedSize?: number;
}

const SampleList: React.FC<SampleListProps> = ({
  submission,
  collapsedSize = 5,
}) => {
  const searchElement = React.useRef<HTMLIonSearchbarElement>(null);

  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string | null>();

  const samples = useMemo(
    // This is reversed so that the most recent samples are shown first
    () => getSubmissionSamples(submission).toReversed(),
    [submission],
  );

  // Whenever the search field changes from hidden to visible, focus on it.
  // This is done in a useEffect so that it happens after the searchbox is rendered.
  useEffect(() => {
    if (isSearchVisible) {
      searchElement.current?.setFocus();
    }
  }, [isSearchVisible]);

  const { search, searchResults } = useMiniSearch(samples, {
    fields: ["samp_name"],
    idField: "_index",
    searchOptions: {
      prefix: true,
      combineWith: "AND",
    },
  });

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
        <IonButton routerLink={paths.sampleCreate(submission.id)}>
          New
        </IonButton>
      </IonListHeader>

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
