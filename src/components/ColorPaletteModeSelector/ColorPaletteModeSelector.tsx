import React from "react";
import { ColorPaletteMode } from "../../theme/colorPalette";
import { AlertInput, IonLabel, useIonAlert } from "@ionic/react";
import { useStore } from "../../Store";

const ColorPaletteModeSelector: React.FC = () => {
  const { setColorPaletteMode, colorPaletteMode } = useStore();
  const [presentAlert] = useIonAlert();

  const radioInputFor = (mode: ColorPaletteMode): AlertInput => {
    return {
      type: "radio",
      label: mode,
      value: mode,
      checked: colorPaletteMode === mode,
    };
  };

  const handleLabelClick = () => {
    return presentAlert({
      header: "Theme",
      inputs: [
        radioInputFor(ColorPaletteMode.Dark),
        radioInputFor(ColorPaletteMode.Light),
        radioInputFor(ColorPaletteMode.System),
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          handler: (value) => {
            setColorPaletteMode(value);
          },
        },
      ],
    });
  };

  return (
    <>
      <IonLabel onClick={handleLabelClick}>
        <h3>Theme</h3>
        <p>{colorPaletteMode}</p>
      </IonLabel>
    </>
  );
};

export default ColorPaletteModeSelector;
