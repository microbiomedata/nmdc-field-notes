import { useHistory } from "react-router-dom";
import { useStore } from "./Store";
import { useIonToast } from "@ionic/react";
import paths from "./paths";
import { useCallback } from "react";
import { close } from "ionicons/icons";

function useLogoutAndRedirect() {
  const history = useHistory();
  const [present] = useIonToast();
  const { logout } = useStore();

  const logoutAndRedirect = useCallback(async () => {
    await logout();
    void present({
      message: "Your session has expired. Please log in again.",
      position: "top",
      swipeGesture: "vertical",
      buttons: [
        {
          role: "cancel",
          icon: close,
        },
      ],
    });
    history.replace(paths.welcome);
  }, [history, logout, present]);

  return { logoutAndRedirect };
}

export default useLogoutAndRedirect;
