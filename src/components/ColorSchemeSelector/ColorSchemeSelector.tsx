import React from "react";
import { activateColorScheme, ColorScheme } from "../../theme";
import { IonSelect, IonSelectOption } from "@ionic/react";

const ColorSchemeSelector: React.FC = () => {
  return (
    <IonSelect
      label={"Color scheme"}
      placeholder={"Select color scheme"}
      onIonChange={(event) => activateColorScheme(event.target.value)}
      value={undefined} // FIXME
    >
      <IonSelectOption value={ColorScheme.Dark}>
        {ColorScheme.Dark}
      </IonSelectOption>
      a
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
