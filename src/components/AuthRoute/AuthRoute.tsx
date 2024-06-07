import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useStore } from "../../Store";
import paths from "../../paths";

const AuthRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isLoggedIn } = useStore();
  return (
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
  );
};

export default AuthRoute;
