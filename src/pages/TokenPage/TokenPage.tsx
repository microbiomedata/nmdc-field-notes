import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../Store";
import { paths } from "../../Router";
import { IonPage, useIonViewWillEnter } from "@ionic/react";

const TokenPage: React.FC = () => {
  const { setApiToken } = useStore();
  const history = useHistory();
  const location = useLocation();

  useIonViewWillEnter(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("token")) {
      setApiToken(params.get("token"));
      history.replace(paths.home);
    }
  });

  return <IonPage>Logging in...</IonPage>;
};

export default TokenPage;
