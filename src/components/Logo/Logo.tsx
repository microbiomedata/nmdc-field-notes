import React from "react";
import logoMarkSvg from "./img/logo-mark.svg";
import logoTextSvg from "./img/logo-text.svg";
import { IonText } from "@ionic/react";
import { IonicReactProps } from "@ionic/react/dist/types/components/IonicReactProps";

import "./Logo.css";

// TODO: Is this a correct type annotation for this component?
const Logo: React.FC<IonicReactProps> = ({ style, ...rest }) => {
  return (
    <IonText
      style={{
        display: "flex",
        height: 55,
        width: 163.656,
        ...style,
      }}
      {...rest}
    >
      <img
        src={logoMarkSvg}
        alt={"NMDC emblem"}
        style={{ height: 55, marginRight: 10 }}
      />
      <img src={logoTextSvg} alt={"NMDC name"} style={{ height: 50 }} />
    </IonText>
  );
};

export default Logo;
