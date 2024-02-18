import React from "react";
import { useCurrentUser } from "../../queries";
import { IonButton, IonCard, IonCardContent } from "@ionic/react";
import { PATHS } from "../../Router";

interface Props {}

const SettingsView: React.FC<Props> = () => {
  const user = useCurrentUser();

  return (
    <>
      <IonCard className={"ion-margin-horizontal"}>
        <IonCardContent>
          {/* TODO: Remove this debug output. */}
          {user.isLoading && <p>Loading...</p>}
          {user.isError && <p>Error: {user.error.message}</p>}
          {user.isSuccess && <p>Welcome: {user.data}</p>}
        </IonCardContent>
      </IonCard>

      <IonButton
        expand={"block"}
        className={"ion-margin-horizontal"}
        href={PATHS.LOGOUT_PAGE}
      >
        Logout
      </IonButton>
    </>
  );
};

export default SettingsView;
