import React from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import config from "../../config";
import ColorPaletteModeSelector from "../../components/ColorPaletteModeSelector/ColorPaletteModeSelector";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { useStore } from "../../Store";
import paths from "../../paths";
import { initiateLogin } from "../../auth";

const SettingsPage: React.FC = () => {
  const { loggedInUser, logout } = useStore();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push(paths.welcome, "none");
  };

  const handleLogin = () => {
    return initiateLogin();
  };

  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonTitle>Settings</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <SectionHeader>User</SectionHeader>
        <IonList className="ion-padding-bottom">
          {loggedInUser ? (
            <>
              <IonItem>
                <IonLabel>
                  <h3>Name</h3>
                  <p>{loggedInUser.name}</p>
                </IonLabel>
              </IonItem>
              <IonItem type="button" onClick={handleLogout}>
                <IonText color="warning">Sign Out</IonText>
              </IonItem>
            </>
          ) : (
            <IonItem type="button" onClick={handleLogin}>
              <IonText>Sign In</IonText>
            </IonItem>
          )}
        </IonList>

        <SectionHeader>About</SectionHeader>
        <IonList className="ion-padding-bottom">
          <IonItem>
            <IonLabel>App version</IonLabel>
            <IonNote color={"medium"} slot={"end"}>
              {config.APP_VERSION}
            </IonNote>
          </IonItem>
        </IonList>

        <SectionHeader>Appearance</SectionHeader>
        <IonList className="ion-padding-bottom">
          <IonItem>
            <ColorPaletteModeSelector />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
