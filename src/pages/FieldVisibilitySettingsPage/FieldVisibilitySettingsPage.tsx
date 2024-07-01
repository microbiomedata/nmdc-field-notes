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
import { useStore } from "../../Store";

interface TemplateItemLabelProps {
  template: string;
}
const TemplateItemLabel: React.FC<TemplateItemLabelProps> = ({ template }) => {
  const { getHiddenSlotsForSchemaClass } = useStore();
  const templateInfo = TEMPLATES[template];
  const hiddenSlots = getHiddenSlotsForSchemaClass(templateInfo.schemaClass);
  return (
    <IonLabel>
      <h3>{templateInfo.displayName}</h3>
      <p>
        {hiddenSlots === undefined
          ? "Not customized"
          : `${hiddenSlots.length} fields hidden`}
      </p>
    </IonLabel>
  );
};

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
          {Object.keys(TEMPLATES).map((template) => (
            <IonItem
              key={template}
              onClick={() => setSelectedTemplate(template)}
            >
              <TemplateItemLabel template={template} />
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
