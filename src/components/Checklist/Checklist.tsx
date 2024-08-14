import React from "react";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { checkmarkCircle, checkmarkCircleOutline } from "ionicons/icons";
import Markdown from "react-markdown";
import SectionHeader from "../SectionHeader/SectionHeader";
import { fieldworkChecklist } from "./md-in-js/fieldworkChecklist";
import styles from "./Checklist.module.css";

const Checklist: React.FC = () => {
  return (
    <div>
      <div className={styles.info}>
        <Markdown>{fieldworkChecklist.info}</Markdown>
      </div>
      {/* Render each section in its own accordion. */}
      {fieldworkChecklist.sections.map((s) => (
        <div key={s.title}>
          <SectionHeader>{s.title}</SectionHeader>
          <div slot={"content"}>
            <Markdown className={styles.info}>{s.info}</Markdown>
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
            <br></br>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
