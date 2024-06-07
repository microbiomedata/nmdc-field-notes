import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import "./HomePage.css";
import StudyList from "../../components/StudyList/StudyList";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import { useStore } from "../../Store";
import { initiateLogin } from "../../auth";

const HEADER_TEXT = "NMDC Field Notes";

const HomePage: React.FC = () => {
  const { isLoggedIn } = useStore();
  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonTitle>{HEADER_TEXT}</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        {isLoggedIn ? (
          <StudyList />
        ) : (
          <div slot="fixed">
            You must <a onClick={initiateLogin}>log in</a> to view and edit
            studies
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
