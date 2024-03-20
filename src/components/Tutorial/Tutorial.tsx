import React from "react";
import {
  IonIcon,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react";
import { informationCircleOutline, checkmarkCircle } from "ionicons/icons";
import { soilPackageTutorial } from "./md-in-js/soilPackageTutorial";
import Markdown from "react-markdown";

import styles from "./Tutorial.module.css";

const Tutorial: React.FC = () => {
  return (
    <IonAccordionGroup>
      <div className={styles.header}>
        <span className={styles.title}>{soilPackageTutorial.header}</span>
        <IonIcon
          id="hover-trigger-soil"
          icon={informationCircleOutline}
          size="small"
          color="primary"
        ></IonIcon>
        <IonPopover trigger="hover-trigger-soil" triggerAction="hover">
          <IonContent class="ion-padding">
            {soilPackageTutorial.info.split("\n").map(function (item, index) {
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
      {soilPackageTutorial.sections.map((s) => (
        <IonAccordion key={s.title}>
          <IonItem slot={"header"}>
            <IonLabel>{s.title}</IonLabel>
          </IonItem>
          <div className={"ion-padding"} slot={"content"}>
            <Markdown
              // Map Markdown elements to React elements.
              components={{
                ul: (props) => <IonList>{props!.children}</IonList>,
                li: (props) => (
                  <IonItem className={styles.listItem} lines={"none"}>
                    <IonIcon
                      size={"small"}
                      slot={"start"}
                      icon={checkmarkCircle}
                      color={"primary"}
                    />
                    {props!.children as string}
                  </IonItem>
                ),
              }}
            >
              {s.md}
            </Markdown>
          </div>
        </IonAccordion>
      ))}
    </IonAccordionGroup>
  );
};

export default Tutorial;
