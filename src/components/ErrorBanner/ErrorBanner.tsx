import React, { PropsWithChildren, useState } from "react";
import Banner from "../Banner/Banner";
import { IonButton, IonLabel } from "@ionic/react";
import { ApiError } from "../../api";
import config from "../../config";

import styles from "./ErrorBanner.module.css";

const { SUPPORT_EMAIL } = config;

function formatError(error: Error): string {
  let formatted = `${error.name}: ${error.message}`;
  if (error instanceof ApiError) {
    formatted += `\n\nRequest: ${error.request.method} ${error.request.url}`;
    formatted += `\n\nResponse: ${error.response.status} ${error.response.statusText}`;
    formatted += `\n${error.responseBody}`;
  }
  return formatted;
}

interface ErrorBannerProps extends PropsWithChildren {
  error: Error;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, children }) => {
  const [isErrorDetailShown, setIsErrorDetailShown] = useState(false);

  const formattedError = formatError(error);
  const emailBody = encodeURIComponent(
    `I encountered the following error while using the app:\n\n${formattedError}`,
  );

  return (
    <>
      <Banner color="danger">
        <IonLabel>{children}</IonLabel>
        <IonButton
          slot="end"
          fill="clear"
          onClick={() => setIsErrorDetailShown((prev) => !prev)}
        >
          {isErrorDetailShown ? "Hide" : "Show"} Details
        </IonButton>
      </Banner>
      {isErrorDetailShown && (
        <div className={`ion-padding ${styles.errorDetails}`}>
          An unexpected error occurred while communicating with the server.
          Please try again later. If the problem persists, please email{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${SUPPORT_EMAIL}?subject=Field Notes Error&body=${emailBody}`}
          >
            {SUPPORT_EMAIL}
          </a>
          <hr />
          Technical details: <br />
          <pre>{formattedError}</pre>
        </div>
      )}
    </>
  );
};

export default ErrorBanner;
