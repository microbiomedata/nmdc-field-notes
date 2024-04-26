import React from "react";
import { ColorScheme } from "../../theme";
import { IonSelect, IonSelectOption } from "@ionic/react";

const ColorSchemeSelector: React.FC = () => {
  return (
    <IonSelect
      label={"Color scheme"}
      placeholder={"Select color scheme"}
      onIonChange={(event) => {
        if (event.target.value === ColorScheme.Dark) {
          document.documentElement.classList.add("ion-palette-dark");
        } else if (event.target.value === ColorScheme.Light) {
          document.documentElement.classList.remove("ion-palette-dark");
        } else {
          // Check whether the web browser indicates that the user prefers dark color schemes.
          // TODO: Also, listen for changes to the system theme, in case the user changes it over time.
          // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia#usage_notes
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("ion-palette-dark");
          } else {
            document.documentElement.classList.remove("ion-palette-dark");
          }
        }
      }}
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
