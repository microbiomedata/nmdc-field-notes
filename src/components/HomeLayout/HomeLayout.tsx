import React, { PropsWithChildren } from "react";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

interface Props extends PropsWithChildren {
  /* Title of the screen. */
  title: string;
}

const HomeLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle size={"large"}>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </>
  );
};

export default HomeLayout;
