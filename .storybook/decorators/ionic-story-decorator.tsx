import { StoryFn } from "@storybook/react";
import { IonApp, IonContent, IonPage, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
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

setupIonicReact();

/**
 * Wraps the specified Story in some Ionic React elements, and returns the resulting React element.
 *
 * @param Story Storybook story you want to wrap
 */
const wrapInIonicElements = (Story: StoryFn) => {
  return (
    <IonApp>
      <IonPage>
        <IonContent>
          <Story />
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default wrapInIonicElements;