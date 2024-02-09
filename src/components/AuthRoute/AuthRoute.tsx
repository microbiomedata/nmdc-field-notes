import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useStore } from "../../Store";
import { PATHS } from "../../Router";

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
                pathname: PATHS.LOGIN_PAGE,
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
