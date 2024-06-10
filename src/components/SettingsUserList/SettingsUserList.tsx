import { IonItem, IonLabel, IonList, useIonRouter } from "@ionic/react";
import React from "react";
import { useStore } from "../../Store";
import paths from "../../paths";
import { initiateLogin } from "../../auth";

const SettingsUserList: React.FC = () => {
  const { loggedInUser, logout } = useStore();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push(paths.welcome, "none");
  };

  const handleLogin = () => {
    return initiateLogin();
  };

  return (
    <IonList className="ion-padding-bottom">
      {loggedInUser ? (
        <>
          <IonItem>
            <IonLabel>
              <h3>Name</h3>
              <p>{loggedInUser.name}</p>
            </IonLabel>
          </IonItem>
          <IonItem type="button" onClick={handleLogout}>
            <IonLabel color="warning">
              <h3>Log Out</h3>
            </IonLabel>
          </IonItem>
        </>
      ) : (
        <>
          <IonItem>
            <IonLabel>
              <p>
                <i>Not logged in</i>
              </p>
            </IonLabel>
          </IonItem>
          <IonItem type="button" onClick={handleLogin}>
            <IonLabel>
              <h3>Log In</h3>
            </IonLabel>
          </IonItem>
        </>
      )}
    </IonList>
  );
};

export default SettingsUserList;
