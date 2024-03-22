import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import "./HomePage.css";
import StudyList from "../../components/StudyList/StudyList";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";

const HEADER_TEXT = "NMDC Field Notes";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonTitle>{HEADER_TEXT}</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <StudyList />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
