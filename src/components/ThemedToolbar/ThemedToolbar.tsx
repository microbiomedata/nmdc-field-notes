import React from "react";
import { IonIcon, IonProgressBar, IonToolbar } from "@ionic/react";
import { cloudOfflineOutline } from "ionicons/icons";
import { useNetworkStatus } from "../../NetworkStatus";

import classes from "./ThemedToolbar.module.css";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

interface ThemedToolbarProps extends React.ComponentProps<typeof IonToolbar> {}

const ThemedToolbar: React.FC<ThemedToolbarProps> = (props) => {
  const { isOnline } = useNetworkStatus();
  const { children, ...rest } = props;
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

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
      <IonToolbar {...rest} className={classes.themedBackground}>
        {children}
      </IonToolbar>
      <IonProgressBar
        type="indeterminate"
        style={{
          visibility: isFetching || isMutating ? "visible" : "hidden",
        }}
      />
    </>
  );
};

export default ThemedToolbar;
