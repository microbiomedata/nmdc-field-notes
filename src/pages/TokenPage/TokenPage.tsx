import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../Store";
import paths from "../../paths";
import {
  IonCol,
  IonGrid,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import { nmdcServerClient } from "../../api";
import { closeBrowser } from "../../auth";
import { useQueryClient } from "@tanstack/react-query";
import FixedCenteredMessage from "../../components/FixedCenteredMessage/FixedCenteredMessage";

const TokenPage: React.FC = () => {
  const { login } = useStore();
  const queryClient = useQueryClient();
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
        // Complete the exchange of an authorization code for access and refresh tokens
        const tokenResponse = await nmdcServerClient.exchangeAuthorizationCode(
          params.get("code")!,
        );

        // Inform the Store about the new tokens
        await login(tokenResponse.access_token, tokenResponse.refresh_token!);

        // If the user was logged out with pending mutations, try and resume them now that they're
        // logged in again.
        queryClient.resumePausedMutations().then(() => {
          void queryClient.invalidateQueries();
        });

        // Continue to the home screen
        history.replace(paths.home);
      } catch (e) {
        setLoginError(true);
      }
    };

    void _login();
  });

  return (
    <IonPage>
      <FixedCenteredMessage>
        {loginError ? (
          <IonText>There was an error logging you in</IonText>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonSpinner />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText>Logging in...</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </FixedCenteredMessage>
    </IonPage>
  );
};

export default TokenPage;
