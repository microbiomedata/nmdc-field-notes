import React from "react";
import {
  IonIcon,
  IonContent,
  IonAccordion, 
  IonAccordionGroup, 
  IonItem, 
  IonLabel,
  IonPopover,
} from "@ionic/react";
import { informationCircleOutline } from 'ionicons/icons';
import TextListItem from "../../components/TextListItem/TextListItem";

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
      
      <IonAccordion value="soildPackage1">
        <IonItem slot="header" >
          <IonLabel>What to consider bringing out to the field to collect sample metadata</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">Way of measuring sampling depth e.g., ruler, measurement device</TextListItem>
          <TextListItem color="primary">Sample storage method (e.g., preservative, cooler, freezer)</TextListItem>
          <TextListItem color="primary">
            Way of labeling samples (e.g., labeled tubes, sharpies, barcodes); 
            can also bring barcode reader to log sample numbers from barcodes in the app
          </TextListItem>
          <TextListItem color="primary">Sample collection device (link the things from sample collection device field)</TextListItem>
          <TextListItem color="primary">Thermometer, or way of measuring air temperature and sample temperature</TextListItem>
          <TextListItem color="primary">Way of measuring elevation </TextListItem>
          <TextListItem color="primary">Way of locating sampling point (latitude and longitude) </TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Way of collecting pH (e.g., pH strips)</TextListItem>
        </div>
      </IonAccordion>
      <IonAccordion value="soildPackage2">
        <IonItem slot="header" >
          <IonLabel>Basic recommendations for fieldwork</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">Bring sunscreen, hat, sunglasses, bug spray </TextListItem>
          <TextListItem color="primary">Tell at least one person where you are going, when you are going, other information about your sampling trip</TextListItem>
          <TextListItem color="primary">Know local animals and dangers they may pose</TextListItem>
          <TextListItem color="primary">Check weather conditions and know risks for local weather events (e.g., flash floods)</TextListItem>
          <TextListItem color="primary">Know risks for injuries in the sampling environment</TextListItem>
          <TextListItem color="primary">Bring plenty of food and water</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
        </div>
      </IonAccordion>
      <IonAccordion value="soildPackage3">
        <IonItem slot="header" >
          <IonLabel>All required fields of the NMDC soil metadata package relevant to the sample and the field collection</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
        </div>
      </IonAccordion>
      <IonAccordion value="soildPackage4">
        <IonItem slot="header" >
          <IonLabel>All recommended fields of the NMDC soil metadata package relevant to the sample and the field collection</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
        </div>
      </IonAccordion>
      <IonAccordion value="soildPackage5">
        <IonItem slot="header" >
          <IonLabel>Other fields in the NMDC Submission Portal that may be relevant to the sample or to later processing steps</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Slope aspect?</TextListItem>
          <TextListItem color="primary">Sample name</TextListItem>
          <TextListItem color="primary">Ecosystem</TextListItem>
        </div>
      </IonAccordion>
      
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