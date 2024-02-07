import React, { useEffect } from "react";
import { useStore } from "../../Store";
import { useHistory } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const { setApiToken } = useStore();
  const history = useHistory();

  useEffect(() => {
    async function logout() {
      await setApiToken(null);
      history.replace("/");
    }
    logout();
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
