import React, { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useLogoutAndRedirect from "../../useLogoutAndRedirect";

function TokenRefreshErrorBoundary({ children }: PropsWithChildren) {
  const { logoutAndRedirect } = useLogoutAndRedirect();

  return (
    <ErrorBoundary fallback={<React.Fragment />} onError={logoutAndRedirect}>
      {children}
    </ErrorBoundary>
  );
}

export default TokenRefreshErrorBoundary;
