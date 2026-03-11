import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

const SunsetNotice: React.FC = () => {
  return (
    <IonCard color="light">
      <IonCardHeader>
        <IonCardTitle>Notice</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Due to a shift in program budget and priorities for 2026, the NMDC is
        not actively developing or maintaining the Field Notes Mobile App.
        Please visit the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://microbiomedata.org/"
        >
          NMDC website
        </a>{" "}
        for more information about our other products to submit, access and
        share microbiome data.
      </IonCardContent>
    </IonCard>
  );
};

export default SunsetNotice;
