import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

const APP_VERSION = import.meta.env.PACKAGE_VERSION;

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
      <IonContent>App version is {APP_VERSION}</IonContent>
    </IonPage>
  );
};

export default SettingsPage;
