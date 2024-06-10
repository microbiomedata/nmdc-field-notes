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
} from "@ionic/react";
import { logIn } from "ionicons/icons";
import Logo from "../../components/Logo/Logo";
import paths from "../../paths";
import classes from "./WelcomePage.module.css";
import { initiateLogin } from "../../auth";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

const WelcomePage: React.FC = () => {
  const router = useIonRouter();

  const handleLogin = () => {
    return initiateLogin();
  };

  return (
    <IonPage>
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
              {/* TODO: Remove element after proving concept. */}
              <IonRow>
                <IonCol className={"ion-text-center"}>
                  <IonButton
                    fill={"clear"}
                    expand={"block"}
                    className={"ion-margin-horizontal"}
                    // Note: Barcode scanning is only available on iOS and Android; not PWA.
                    onClick={async () => {
                      // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#ios
                      // Hide everything except the camera feed.
                      document
                        .querySelector("body")
                        ?.classList.add("barcode-scanner-active");

                      // Listen for events named "barcodeScanned".
                      await BarcodeScanner.addListener(
                        "barcodeScanned",
                        async (result) => {
                          // Remove the event listener (any that are attached).
                          // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#removealllisteners
                          console.debug("Removing 'barcodeScanned' listeners.")
                          await BarcodeScanner.removeAllListeners();

                          console.debug(result.barcode);
                          alert(JSON.stringify(result.barcode));

                          // Stop scanning for barcodes.
                          // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#stopscan
                          console.debug("Stopping scanning for barcodes.")
                          await BarcodeScanner.stopScan();
                        },
                      );

                      // Start scanning for barcodes.
                      // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#startscan
                      await BarcodeScanner.startScan();
                    }}
                  >
                    Scan barcode (iOS / Android)
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
