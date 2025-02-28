import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import Markdown from "../../components/Markdown/Markdown";

import guidePageMd from "./md/guide-page.md?raw";

const GuidePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonTitle>Guide</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <Markdown>{guidePageMd}</Markdown>
      </IonContent>
    </IonPage>
  );
};

export default GuidePage;
