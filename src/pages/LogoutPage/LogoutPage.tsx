import React from "react";
import { useStore } from "../../Store";
import { useHistory } from "react-router-dom";
import paths from "../../paths";
import { IonPage, useIonViewWillEnter } from "@ionic/react";

const LogoutPage: React.FC = () => {
  const { logout } = useStore();
  const history = useHistory();

  useIonViewWillEnter(() => {
    async function _logout() {
      await logout();
      history.replace(paths.root);
    }
    _logout();
  });

  return <IonPage>Logging out...</IonPage>;
};

export default LogoutPage;
