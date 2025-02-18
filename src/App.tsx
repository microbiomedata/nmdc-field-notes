import React from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import ColorSchemePreferenceMonitor from "./components/ColorSchemePreferenceMonitor/ColorSchemePreferenceMonitor";
import DataPrefetcher from "./components/DataPrefetcher/DataPrefetcher";
import QueryClientProvider from "./QueryClientProvider";
import NetworkStatusProvider from "./NetworkStatus";
import Router from "./Router";
import StoreProvider from "./Store";
import AppTourProvider from "./components/AppTourProvider/AppTourProvider";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic
 *
 * Note: In Ionic v8, Dynamic Font Scaling is enabled by default as long as the `typography.css` file is imported.
 *       Reference: https://ionicframework.com/docs/layout/dynamic-font-scaling#enabling-in-an-application
 */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/*
 * Ionic dark color palette.
 *
 * Reference: https://ionicframework.com/docs/theming/dark-mode
 *
 * Note: According to the "CSS Class" section of the documentation:
 *       When using the `dark.class.css` CSS file...
 *       > "The `.ion-palette-dark` class must be added to the `html`
 *       > element in order to work with the imported dark palette."
 */
import "@ionic/react/css/palettes/dark.class.css";

/* Theme variables */
import "./theme/variables.css";

/* Our own global styles */
import "./theme/global.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <NetworkStatusProvider>
      <StoreProvider>
        <QueryClientProvider>
          <AppTourProvider steps={[]}>
            <IonApp>
              <ColorSchemePreferenceMonitor />
              <DataPrefetcher />
              <Router />
            </IonApp>
          </AppTourProvider>
        </QueryClientProvider>
      </StoreProvider>
    </NetworkStatusProvider>
  );
};

export default App;
