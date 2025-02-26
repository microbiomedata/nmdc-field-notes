import { useHistory } from "react-router-dom";
import { useStore } from "./Store";
import { useIonToast } from "@ionic/react";
import paths from "./paths";
import { useCallback } from "react";
import { close } from "ionicons/icons";
import { useQueryClient } from "@tanstack/react-query";

function useLogoutAndRedirect() {
  const queryClient = useQueryClient();
  const history = useHistory();
  const [present] = useIonToast();
  const { logout, isLoggedIn } = useStore();

  const logoutAndRedirect = useCallback(async () => {
    // This function may be invoked multiple times by different components, but the process only
    // needs to happen once (in particular we don't want multiple toasts to be shown). Check if the
    // user is already logged out and if so, return early.
    if (!isLoggedIn) {
      return;
    }

    // Cancel any pending queries (i.e. ones that are still pending because they were initiated
    // while offline). There is no advantage to resuming them post-login.
    await queryClient.cancelQueries();

    // Log the user out, present the toast message, and redirect to the welcome page.
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
  }, [history, isLoggedIn, logout, present, queryClient]);

  return { logoutAndRedirect };
}

export default useLogoutAndRedirect;
