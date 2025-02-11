import React, { useCallback, PropsWithChildren } from "react";
import { useHistory } from "react-router-dom";
import { useStore } from "../../Store";
import { useIonToast } from "@ionic/react";
import { ErrorBoundary } from "react-error-boundary";
import paths from "../../paths";

function TokenRefreshErrorBoundary({ children }: PropsWithChildren) {
  const history = useHistory();
  const [present] = useIonToast();
  const { logout } = useStore();

  const handleExchangeFailure = useCallback(async () => {
    await logout();
    void present({
      message: "Your session has expired. Please log in again.",
      duration: 5000,
    });
    history.replace(paths.root);
  }, [history, logout, present]);

  return (
    <ErrorBoundary
      fallback={<React.Fragment />}
      onError={handleExchangeFailure}
    >
      {children}
    </ErrorBoundary>
  );
}

export default TokenRefreshErrorBoundary;
