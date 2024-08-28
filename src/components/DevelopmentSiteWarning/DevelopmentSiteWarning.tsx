import React from "react";
import config from "../../config";
import Banner from "../Banner/Banner";
import { IonLabel } from "@ionic/react";

const { SHOW_DEV_SITE_WARNING } = config;

const DevelopmentSiteWarning: React.FC = () => {
  if (!SHOW_DEV_SITE_WARNING) {
    return null;
  }

  return (
    <Banner color="warning">
      <IonLabel className="ion-no-margin ion-text-center">
        <b>Development Site</b> Do not enter any real data here.
      </IonLabel>
    </Banner>
  );
};

export default DevelopmentSiteWarning;
