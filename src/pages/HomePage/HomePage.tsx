import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import StudyList from "../../components/StudyList/StudyList";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import { useStore } from "../../Store";
import { initiateLogin } from "../../auth";
import FixedCenteredMessage from "../../components/FixedCenteredMessage/FixedCenteredMessage";

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
          <FixedCenteredMessage>
            <a onClick={initiateLogin}>Log in</a> to view and edit studies
          </FixedCenteredMessage>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
