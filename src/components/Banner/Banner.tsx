import React, { PropsWithChildren } from "react";
import { Color } from "@ionic/core";
import { IonItem, IonList } from "@ionic/react";

import styles from "./Banner.module.css";

export interface BannerProps extends PropsWithChildren {
  color?: Color | string;
}
const Banner: React.FC<BannerProps> = ({ children, color }) => {
  return (
    <IonList className={styles.banner}>
      <IonItem lines="none" color={color}>
        {children}
      </IonItem>
    </IonList>
  );
};

export default Banner;
