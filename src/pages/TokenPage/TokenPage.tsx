import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../Store";
import paths from "../../paths";
import { IonPage, useIonViewWillEnter } from "@ionic/react";
import { nmdcServerClient } from "../../api";
import { closeBrowser } from "../../auth";

const TokenPage: React.FC = () => {
  const { login } = useStore();
  const history = useHistory();
  const location = useLocation();
  const [loginError, setLoginError] = useState(false);

  useIonViewWillEnter(() => {
    const _login = async () => {
      await closeBrowser();
      const params = new URLSearchParams(location.search);
      if (!params.has("code")) {
        setLoginError(true);
        return;
      }
      try {
        const tokenResponse = await nmdcServerClient.exchangeAuthorizationCode(
          params.get("code")!,
        );
        await login(tokenResponse.access_token, tokenResponse.refresh_token!);
        history.replace(paths.home);
      } catch (e) {
        setLoginError(true);
      }
    };

    void _login();
  });

  return (
    <IonPage>
      {loginError ? "There was an error logging you in" : "Logging in..."}
    </IonPage>
  );
};

export default TokenPage;
