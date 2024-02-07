import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../Store";

const TokenPage: React.FC = () => {
  const { setApiToken } = useStore();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("token")) {
      setApiToken(params.get("token"));
      history.replace("/home");
    }
  }, [location.search]);

  return <div>Logging in...</div>;
};

export default TokenPage;
