import React, { useEffect } from "react";
import { useStore } from "../../Store";
import useLogoutAndRedirect from "../../useLogoutAndRedirect";

const MAX_DELAY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * This component is responsible for monitoring the expiration of the refresh token. If the token
 * will expire soon, it sets up a timer to log out the user just before the expiration time.
 */
const RefreshTokenExpirationMonitor: React.FC = () => {
  const { refreshTokenExpiration } = useStore();
  const { logoutAndRedirect } = useLogoutAndRedirect();

  useEffect(() => {
    if (refreshTokenExpiration == null) {
      return;
    }

    // We don't always set up the timer here because `setTimeout` has a maximum delay of 2^31 - 1
    // milliseconds, which is about 24.8 days. Many times the expiration will be much further out
    // than that. We only set up the timer if the expiration is less than 7 days away. This is a
    // somewhat arbitrary value that is both less than the maximum delay and larger than the amount
    // of time a user is likely to be continuously using the app.
    let logoutTimer: NodeJS.Timeout;
    const msUntilExpiration = refreshTokenExpiration.getTime() - Date.now();
    if (msUntilExpiration < MAX_DELAY_MS) {
      logoutTimer = setTimeout(logoutAndRedirect, msUntilExpiration);
    }

    return () => clearTimeout(logoutTimer);
  }, [refreshTokenExpiration, logoutAndRedirect]);

  return null;
};

export default RefreshTokenExpirationMonitor;
