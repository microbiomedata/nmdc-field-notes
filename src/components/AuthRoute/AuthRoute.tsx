import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useStore } from "../../Store";
import paths from "../../paths";
import TokenRefreshErrorBoundary from "../TokenRefreshErrorBoundary/TokenRefreshErrorBoundary";

const AuthRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isLoggedIn } = useStore();
  return (
    <TokenRefreshErrorBoundary>
      <Route
        {...rest}
        render={({ location }) => {
          if (isLoggedIn) {
            return <>{children}</>;
          } else {
            return (
              <Redirect
                to={{
                  pathname: paths.welcome,
                  state: { from: location },
                }}
              />
            );
          }
        }}
      />
    </TokenRefreshErrorBoundary>
  );
};

export default AuthRoute;
