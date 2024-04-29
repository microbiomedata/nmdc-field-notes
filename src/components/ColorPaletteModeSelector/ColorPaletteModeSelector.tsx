import React from "react";
import { ColorPaletteMode } from "../../theme/colorPalette";
import { IonSelect, IonSelectOption } from "@ionic/react";
import { useStore } from "../../Store";

const ColorPaletteModeSelector: React.FC = () => {
  const { setColorPaletteMode, colorPaletteMode } = useStore();

  return (
    <IonSelect
      label={"Color scheme"}
      placeholder={"Select color scheme"}
      onIonChange={(event) => setColorPaletteMode(event.target.value)}
      value={colorPaletteMode}
    >
      <IonSelectOption value={ColorPaletteMode.Dark}>
        {ColorPaletteMode.Dark}
      </IonSelectOption>
      <IonSelectOption value={ColorPaletteMode.Light}>
        {ColorPaletteMode.Light}
      </IonSelectOption>
      <IonSelectOption value={ColorPaletteMode.System}>
        {ColorPaletteMode.System}
      </IonSelectOption>
    </IonSelect>
  );
};

export default ColorPaletteModeSelector;
