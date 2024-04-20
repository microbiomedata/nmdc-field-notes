import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
} from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import config from "../../config";

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot={"start"}>
            <IonBackButton defaultHref={"/"}></IonBackButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset={true}>
          <IonItem>
            <IonLabel>App version</IonLabel>
            <IonNote color={"medium"}>{config.APP_VERSION}</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
