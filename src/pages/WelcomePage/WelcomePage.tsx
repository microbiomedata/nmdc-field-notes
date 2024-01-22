import React from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
} from "@ionic/react";
import { logIn } from "ionicons/icons";
import Logo from "../../components/Logo/Logo";
import { PATHS } from "../../App";
import "./WelcomePage.css";

const WelcomePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className={"ion-padding"}>
        <IonGrid style={{ height: "100%" }}>
          <IonRow class={"ion-align-items-center"} style={{ height: "100%" }}>
            <IonCol>
              <IonRow>
                <IonCol class={"ion-text-center"}>
                  <Logo style={{ margin: "auto" }} />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol class={"ion-text-center"}>
                  <IonCard style={{ marginBottom: 0 }}>
                    <IonCardHeader>
                      <IonCardTitle>Welcome</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ paddingBottom: 0 }}>
                      Welcome to NMDC Field Notes, an app designed to help you
                      collect environmental metadata on the go.
                    </IonCardContent>
                    <IonButton fill={"clear"} routerLink={PATHS.TUTORIAL_PAGE}>
                      Take the tutorial
                    </IonButton>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol class={"ion-text-center"}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Checklist</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ paddingBottom: 0 }}>
                      Before you go out into the field, do you have everything
                      you need to collect your metadata?
                    </IonCardContent>
                    <IonButton
                      fill={"clear"}
                      // TODO: Navigate to the checklist screen.
                      onClick={() => console.log("View the checklist")}
                    >
                      View the checklist
                    </IonButton>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol class={"ion-text-center"}>
                  <IonButton
                    expand={"block"}
                    style={{ marginInline: 16 }}
                    // TODO: Initiate the ORCiD Login flow.
                    onClick={() => console.log("Login with ORCiD")}
                  >
                    <IonIcon
                      icon={logIn}
                      aria-hidden={"true"}
                      slot={"start"}
                    ></IonIcon>
                    Login with ORCiD
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol class={"ion-text-center"}>
                  <IonButton
                    fill={"clear"}
                    id={"show-alert-for-continue-without-login"}
                    expand={"block"}
                    style={{ marginInline: 16 }}
                  >
                    Continue without Login
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonAlert
                trigger={"show-alert-for-continue-without-login"}
                header={"Continue without Login"}
                message={
                  "Only logged-in users can sync their metadata with the NMDC Submission Portal."
                }
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                  },
                  {
                    text: "Continue",
                    role: "confirm",
                    handler: () => {
                      // TODO: Navigate to the next screen.
                      console.log("Continue without Login");
                    },
                  },
                ]}
              ></IonAlert>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
