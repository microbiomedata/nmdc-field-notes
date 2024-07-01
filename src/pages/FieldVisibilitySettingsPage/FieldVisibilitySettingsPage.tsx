import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
} from "@ionic/react";
import paths from "../../paths";
import { TEMPLATES } from "../../api";
import ThemedToolbar from "../../components/ThemedToolbar/ThemedToolbar";
import SlotSelectorModal from "../../components/SlotSelectorModal/SlotSelectorModal";

const FieldVisibilitySettingsPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    string | undefined
  >(undefined);

  return (
    <IonPage>
      <IonHeader>
        <ThemedToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={paths.settings} />
          </IonButtons>
          <IonTitle>Field Visibility</IonTitle>
        </ThemedToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-padding">
          Select a template to customize which fields are visible by default.
        </p>
        <IonList className="ion-padding-bottom">
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <IonItem key={key} onClick={() => setSelectedTemplate(key)}>
              <IonLabel>
                <h3>{template.displayName}</h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <SlotSelectorModal
          onDismiss={() => setSelectedTemplate(undefined)}
          isOpen={selectedTemplate !== undefined}
          packageName={selectedTemplate}
        />
      </IonContent>
    </IonPage>
  );
};

export default FieldVisibilitySettingsPage;
