import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./HomePage.css";
import StudyList from "../../components/StudyList/StudyList";

const HEADER_TEXT = "NMDC Field Notes";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{HEADER_TEXT}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{HEADER_TEXT}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <StudyList />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
