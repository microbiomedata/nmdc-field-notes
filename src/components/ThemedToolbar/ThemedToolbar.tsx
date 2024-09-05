import React from "react";
import { IonIcon, IonProgressBar, IonToolbar } from "@ionic/react";
import { cloudOfflineOutline } from "ionicons/icons";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useNetworkStatus } from "../../NetworkStatus";
import DevelopmentSiteWarning from "../DevelopmentSiteWarning/DevelopmentSiteWarning";

import classes from "./ThemedToolbar.module.css";

interface ThemedToolbarProps extends React.ComponentProps<typeof IonToolbar> {}

const ThemedToolbar: React.FC<ThemedToolbarProps> = (props) => {
  const { isOnline } = useNetworkStatus();
  const { children, ...rest } = props;
  const isFetching = useIsFetching();
  const isMutating = useIsMutating({ predicate: (m) => !m.state.isPaused });

  return (
    <>
      {!isOnline && (
        <IonToolbar color="medium" className={classes.offlineToolbar}>
          <div className={classes.offlineWarning}>
            <IonIcon icon={cloudOfflineOutline} />
            <div>You are offline</div>
          </div>
        </IonToolbar>
      )}
      <DevelopmentSiteWarning />
      <IonToolbar {...rest} className={classes.themedBackground}>
        {children}
      </IonToolbar>
      {(isFetching > 0 || isMutating > 0) && (
        <IonProgressBar className={classes.loadingBar} type="indeterminate" />
      )}
    </>
  );
};

export default ThemedToolbar;
