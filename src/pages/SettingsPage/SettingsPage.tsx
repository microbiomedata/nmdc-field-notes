import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SettingsUserList from "../../components/SettingsUserList/SettingsUserList";
import SettingsAboutList from "../../components/SettingsAboutList/SettingsAboutList";
import SettingsAppearanceList from "../../components/SettingsAppearanceList/SettingsAppearanceList";

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonTitle>Settings</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <SectionHeader>User</SectionHeader>
        <SettingsUserList />

        <SectionHeader>Appearance</SectionHeader>
        <SettingsAppearanceList />

        <SectionHeader>About</SectionHeader>
        <SettingsAboutList />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
