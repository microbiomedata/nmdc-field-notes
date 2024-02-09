import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
import { useCurrentUser } from "../queries";

const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NMDC Field Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">NMDC Field Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        {currentUser.isLoading && <p>Loading...</p>}
        {currentUser.isError && <p>Error: {currentUser.error.message}</p>}
        {currentUser.isSuccess && <p>Welcome: {currentUser.data}</p>}
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
