import React from "react";
import { ColorScheme } from "../../theme/colorScheme";
import { IonSelect, IonSelectOption } from "@ionic/react";
import { useStore } from "../../Store";

const ColorSchemeSelector: React.FC = () => {
  const { setColorScheme, colorScheme } = useStore();

  return (
    <IonSelect
      label={"Color scheme"}
      placeholder={"Select color scheme"}
      onIonChange={(event) => setColorScheme(event.target.value)}
      value={colorScheme}
    >
      <IonSelectOption value={ColorScheme.Dark}>
        {ColorScheme.Dark}
      </IonSelectOption>
      <IonSelectOption value={ColorScheme.Light}>
        {ColorScheme.Light}
      </IonSelectOption>
      <IonSelectOption value={ColorScheme.System}>
        {ColorScheme.System}
      </IonSelectOption>
    </IonSelect>
  );
};

export default ColorSchemeSelector;
