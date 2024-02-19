import React from "react";
import { useCurrentUser } from "../../queries";
import { IonCard, IonCardContent, IonRouterLink } from "@ionic/react";
import { PATHS } from "../../Router";

interface Props {}

const SettingsView: React.FC<Props> = () => {
  const user = useCurrentUser();

  return (
    <IonCard>
      <IonCardContent>
        <div>
          {user.isLoading && <code>Loading...</code>}
          {user.isError && <code>Error: {user.error.message}</code>}
          {user.isSuccess && <code>Welcome: {user.data}</code>}
        </div>
        <IonRouterLink routerLink={PATHS.LOGOUT_PAGE}>Logout</IonRouterLink>
      </IonCardContent>
    </IonCard>
  );
};

export default SettingsView;
