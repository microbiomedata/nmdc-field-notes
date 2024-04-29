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
import ColorPaletteModeSelector from "../../components/ColorPaletteModeSelector/ColorPaletteModeSelector";

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
        <IonList>
          <IonItem>
            <IonLabel>App version</IonLabel>
            <IonNote color={"medium"} slot={"end"}>
              {config.APP_VERSION}
            </IonNote>
          </IonItem>
          <IonItem>
            <ColorPaletteModeSelector />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
