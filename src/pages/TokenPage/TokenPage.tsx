import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../Store";
import { PATHS } from "../../Router";

const TokenPage: React.FC = () => {
  const { setApiToken } = useStore();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("token")) {
      setApiToken(params.get("token"));
      history.replace(PATHS.HOME_PAGE);
    }
  }, [location.search]);

  return <div>Logging in...</div>;
};

export default TokenPage;
