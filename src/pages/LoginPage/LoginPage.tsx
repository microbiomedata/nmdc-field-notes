import React from "react";
import { IonButton, IonPage } from "@ionic/react";
import { initiateLogin } from "../../auth";

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    return initiateLogin();
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
