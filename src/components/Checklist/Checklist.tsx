import React from "react";
import {
  IonIcon,
  IonContent,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react";
import { informationCircleOutline, checkmarkCircle, checkmarkCircleOutline } from "ionicons/icons";
import { fieldworkChecklist } from "./md-in-js/fieldworkChecklist";
import Markdown from "react-markdown";

import styles from "./Checklist.module.css";

const Checklist: React.FC = () => {
  return (
    <IonAccordionGroup>
      <div className={styles.header}>
        <span className={styles.title}>{fieldworkChecklist.header}</span>
        <IonIcon
          id="hover-trigger-fieldwork"
          icon={informationCircleOutline}
          size="small"
          color="primary"
        ></IonIcon>
        <IonPopover className={styles.popover} trigger="hover-trigger-fieldwork" triggerAction="hover">
          <IonContent class="ion-padding">
            {fieldworkChecklist.info.split("\n").map(function (item, index) {
              return (
                <span key={index}>
                  {item}
                  <br />
                </span>
              );
            })}
          </IonContent>
        </IonPopover>
      </div>

      {/* Render each section in its own accordion. */}
      {fieldworkChecklist.sections.map((s) => (
        <div key={s.title}>
          <IonItem slot={"header"} className={styles.section}>
            <IonLabel className={styles.title}>{s.title}</IonLabel>
          </IonItem>
          <div className={"ion-padding"} slot={"content"}>
            <Markdown
              // Map Markdown elements to React elements.
              components={{
                ul: (props) => <IonList>{props!.children}</IonList>,
                li: (props) =>{
                  // use different icon for the nested list item
                  const match = /^NESTEDLISTITEM/.exec(props!.children?.toString() || '')
                  return match ?  (
                  <IonItem className={styles.listItem} lines={"none"}>
                    <IonIcon
                      className={styles.listIcon}
                      size={"small"}
                      slot={"start"}
                      icon={checkmarkCircleOutline}
                      color={"primary"}
                    />
                    <IonLabel className={styles.listLabel}>{props!.children?.toString().replace(/NESTEDLISTITEM /, '')}</IonLabel>
                  </IonItem>
                ): (
                  <IonItem className={styles.listItem} lines={"none"}>
                    <IonIcon
                      className={styles.listIcon}
                      size={"small"}
                      slot={"start"}
                      icon={checkmarkCircle}
                      color={"primary"}
                    />
                    <IonLabel className={styles.listLabel}>{props!.children}</IonLabel>
                  </IonItem>
                )},
              }}
            >
              {s.md}
            </Markdown>
          </div>
        </div>
      ))}
    </IonAccordionGroup>
  );
};

export default Checklist;
