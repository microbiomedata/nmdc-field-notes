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
import { informationCircleOutline, checkmarkCircle } from 'ionicons/icons';
import TextListItem from "../../components/TextListItem/TextListItem";
import { sections } from "./md-in-js";
import Markdown from "react-markdown";

import "./Tutorial.css";

const Tutorial: React.FC = () => {
  return (
    <IonAccordionGroup>
      <div className="tutorial-header">
        <span className="title">Soil Package</span>
        <IonIcon id="hover-trigger-soil" icon={informationCircleOutline} size="small" color="primary"></IonIcon>
        <IonPopover trigger="hover-trigger-soil" triggerAction="hover">
          <IonContent class="ion-padding">
            Are you planning a trip to the field to collect soil samples and metadata? 
            Below we have listed the NMDC soil package required metadata fields to ensure 
            you pack the right tools and make required measurements in the field!
            <br></br>
            <br></br>
            Note: The NMDC metadata requirements also encompass fields required by NCBI and 
            the Genomic Standards Consortium (GSC)
          </IonContent>
        </IonPopover>
      </div>

      {/* Render each section in its own accordion. */}
      {sections.map(s => (
        <IonAccordion key={s.title}>
          <IonItem slot={"header"}>
            <IonLabel>{s.title}</IonLabel>
          </IonItem>
          <div className={"ion-padding"} slot={"content"}>
            <Markdown
              // Map Markdown elements to React elements.
              components={{
                ul: (props) => (
                    <IonList>{props!.children}</IonList>
                ),
                li: (props) => (
                  <IonItem lines={"none"}>
                    <IonIcon slot={"start"} icon={checkmarkCircle} color={"primary"} />
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

      <div className="tutorial-header">
        <span className="title">Metadata Collection</span>
        <IonIcon id="hover-trigger-metadata" icon={informationCircleOutline} size="small" color="primary"></IonIcon>
        <IonPopover trigger="hover-trigger-metadata" triggerAction="hover">
          <IonContent class="ion-padding">
            Metadata collection in the field
          </IonContent>
        </IonPopover>
      </div>

      <IonAccordion value="metadata1">
        <IonItem slot="header" >
          <IonLabel>metadata collection 1</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">item</TextListItem>
          <TextListItem color="primary">item</TextListItem>
        </div>
      </IonAccordion>
      <IonAccordion value="metadata2">
        <IonItem slot="header" >
          <IonLabel>metadata collection 2</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">item</TextListItem>
          <TextListItem color="primary">item</TextListItem>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  );
};

export default Tutorial;