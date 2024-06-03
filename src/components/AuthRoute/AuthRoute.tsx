import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useStore } from "../../Store";
import paths from "../../paths";

const AuthRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { apiToken } = useStore();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (apiToken) {
          return <>{children}</>;
        } else {
          return (
            <Redirect
              to={{
                pathname: paths.login,
                state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default AuthRoute;
