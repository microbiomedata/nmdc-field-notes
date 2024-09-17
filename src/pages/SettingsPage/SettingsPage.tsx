import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SettingsUserList from "../../components/SettingsUserList/SettingsUserList";
import SettingsAboutList from "../../components/SettingsAboutList/SettingsAboutList";
import SettingsAppearanceList from "../../components/SettingsAppearanceList/SettingsAppearanceList";
import { StepType } from "@reactour/tour";
import { useAppTour } from "../../components/CustomTourProvider/hooks";
import { TourId } from "../../components/CustomTourProvider/AppTourProvider";

// Make steps for the tour.
const steps: Array<StepType> = [
  {
    selector: `[data-tour="${TourId.SettingsPage}-1"]`,
    content:
      "The Settings screen shows your user account, your display preferences, and the app version.",
  },
  {
    selector: `[data-tour="${TourId.SettingsPage}-2"]`,
    content: "Here, you can see who you're logged in as. You can also log out.",
  },
  {
    selector: `[data-tour="${TourId.SettingsPage}-3"]`,
    content: (
      <>
        <p style={{ marginBlockStart: 0 }}>
          Here, you can switch between light and dark themes.
        </p>
        <p>
          Also, you can specify which fields you want to be visible in each
          environment template.
        </p>
        <p>
          Lastly, you can reset these on-screen tours so that they appear again
          throughout the app.
        </p>
      </>
    ),
  },
  {
    selector: `[data-tour="${TourId.SettingsPage}-4"]`,
    content: (
      <>
        Finally, this section is about the app, itself. It contains the
        app&apos;s version number.
      </>
    ),
  },
];

const SettingsPage: React.FC = () => {
  useAppTour(TourId.SettingsPage, steps);

  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar data-tour={`${TourId.SettingsPage}-1`}>
          <IonTitle>Settings</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <span data-tour={`${TourId.SettingsPage}-2`}>
          <SectionHeader>User</SectionHeader>
          <SettingsUserList />
        </span>

        <span data-tour={`${TourId.SettingsPage}-3`}>
          <SectionHeader>Appearance</SectionHeader>
          <SettingsAppearanceList />
        </span>

        <span data-tour={`${TourId.SettingsPage}-4`}>
          <SectionHeader>About</SectionHeader>
          <SettingsAboutList />
        </span>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
