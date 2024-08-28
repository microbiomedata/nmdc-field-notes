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
          <IonRow className={`${classes.fullHeight} ion-align-items-center`}>
            <IonCol>
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <Logo className={classes.marginAuto} />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <IonCard className={classes.marginBottomZero}>
                    <IonCardHeader>
                      <IonCardTitle>Welcome</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className={classes.paddingBottomZero}>
                      Welcome to NMDC Field Notes, an app designed to help you
                      collect environmental metadata on the go.
                    </IonCardContent>
                    <IonButton fill={"clear"} routerLink={paths.tour}>
                      Take a tour
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
                    <IonCardContent className={classes.paddingBottomZero}>
                      Before you go out into the field, do you have everything
                      you need to collect your metadata?
                    </IonCardContent>
                    <IonButton fill={"clear"} routerLink={paths.checklist}>
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
              </IonRow>
              <IonRow>
                <IonCol className={"ion-text-center"}>
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
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
