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
  useIonRouter,
  IonHeader,
} from "@ionic/react";
import { logIn } from "ionicons/icons";
import Logo from "../../components/Logo/Logo";
import paths from "../../paths";
import classes from "./WelcomePage.module.css";
import { initiateLogin } from "../../auth";
import DevelopmentSiteWarning from "../../components/DevelopmentSiteWarning/DevelopmentSiteWarning";

const WelcomePage: React.FC = () => {
  const router = useIonRouter();

  const handleLogin = () => {
    return initiateLogin();
  };

  return (
    <IonPage>
      <IonHeader>
        <DevelopmentSiteWarning />
      </IonHeader>
      <IonContent
        fullscreen
        className={`ion-padding ${classes.themedBackground}`}
      >
        <IonGrid className={classes.fullHeight}>
          <IonRow
            className={`${classes.fullHeight} ion-align-items-stretch ion-justify-content-between`}
          >
            <IonCol size={"12"} className={"ion-text-center"}>
              <Logo className={classes.marginAuto} />
            </IonCol>
            <IonCol
              size={"12"}
              className={"ion-text-center ion-align-self-center"}
            >
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Welcome</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className={classes.paddingBottomZero}>
                  Welcome to NMDC Field Notes, an app designed to help you
                  collect environmental metadata on&nbsp;the&nbsp;go.
                </IonCardContent>
                <IonButton
                  fill={"clear"}
                  href={"https://microbiomedata.org/field-notes/"}
                >
                  Learn more
                </IonButton>
              </IonCard>
            </IonCol>
            <IonCol size={"12"} className={"ion-align-self-end"}>
              <IonRow>
                <IonCol size={"12"} className={"ion-text-center"}>
                  <IonButton
                    expand={"block"}
                    className={"ion-margin-horizontal"}
                    onClick={handleLogin}
                  >
                    <IonIcon
                      icon={logIn}
                      aria-hidden={"true"}
                      slot={"start"}
                    ></IonIcon>
                    Log in with ORCiD
                  </IonButton>
                </IonCol>
                <IonCol size={"12"} className={"ion-text-center"}>
                  <IonButton
                    fill={"clear"}
                    id={"show-alert-for-continue-without-login"}
                    expand={"block"}
                    className={"ion-margin-horizontal"}
                  >
                    Continue without logging in
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonAlert
          trigger={"show-alert-for-continue-without-login"}
          header={"Continue without logging in?"}
          message={
            "You will need to log in before you can sync metadata with the NMDC Submission Portal."
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
                router.push(paths.home, "forward");
              },
            },
          ]}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
