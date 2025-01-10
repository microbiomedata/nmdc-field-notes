import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { setAnalyticsCurrentScreen } from "./analytics";

const AnalyticsScreenViewListener: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    console.debug("Attaching screen_view listener");
    const removeListener = history.listen((location) => {
      void setAnalyticsCurrentScreen(location.pathname);
    });

    return () => {
      console.debug("Detaching route listener");
      removeListener();
    };
  }, [history]);

  return null;
};

export default AnalyticsScreenViewListener;
