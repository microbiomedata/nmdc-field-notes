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
import { paths } from "../../Router";
import "./WelcomePage.css";
import { Browser } from "@capacitor/browser";
import config from "../../config";

const WelcomePage: React.FC = () => {
  const handleLogin = async () => {
    await Browser.open({
      url: `${config.NMDC_SERVER_LOGIN_URL}?behavior=app`,
      windowName: "_self", // web only
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen className={"ion-padding"}>
        <IonGrid className={"nmdc__full-height"}>
          <IonRow className={"nmdc__full-height ion-align-items-center"}>
            <IonCol>
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <Logo className={"nmdc__margin-auto"} />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <IonCard className={"nmdc__margin-bottom-0"}>
                    <IonCardHeader>
                      <IonCardTitle>Welcome</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className={"nmdc__padding-bottom-0"}>
                      Welcome to NMDC Field Notes, an app designed to help you
                      collect environmental metadata on the go.
                    </IonCardContent>
                    <IonButton fill={"clear"} routerLink={paths.tutorial}>
                      Take the tutorial
                    </IonButton>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Checklist</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className={"nmdc__padding-bottom-0"}>
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
                <IonCol className={"ion-text-center"}>
                  <IonButton
                    expand={"block"}
                    className={"ion-margin-horizontal"}
                    // TODO: Initiate the ORCiD Login flow.
                    onClick={handleLogin}
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
                <IonCol className={"ion-text-center"}>
                  <IonButton
                    fill={"clear"}
                    id={"show-alert-for-continue-without-login"}
                    expand={"block"}
                    className={"ion-margin-horizontal"}
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
