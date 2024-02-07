import React from "react";
import { IonButton, IonPage } from "@ionic/react";

import { Browser } from "@capacitor/browser";

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    await Browser.open({
      url: `${import.meta.env.VITE_NMDC_SERVER_LOGIN_URL}?behavior=app`,
      windowName: "_self", // web only
    });
  };

  return (
    <IonPage>
      <p>
        You must log in to view this.
        <IonButton onClick={handleLogin}>Login</IonButton>
      </p>
    </IonPage>
  );
};

export default LoginPage;
