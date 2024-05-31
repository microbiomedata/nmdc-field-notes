import React from "react";
import { useStore } from "../../Store";
import { useHistory } from "react-router-dom";
import { paths } from "../../Router";
import { IonPage, useIonViewWillEnter } from "@ionic/react";

const LogoutPage: React.FC = () => {
  const { setApiToken } = useStore();
  const history = useHistory();

  useIonViewWillEnter(() => {
    async function logout() {
      await setApiToken(null);
      history.replace(paths.root);
    }
    logout();
  });

  return <IonPage>Logging out...</IonPage>;
};

export default LogoutPage;
