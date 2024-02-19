import React, { PropsWithChildren } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from "@ionic/react";

interface Props extends PropsWithChildren {
  /* Title of the screen. */
  title: string;
}

const HomeLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          {/* FIXME: The back button doesn't appear unless I pass its optional `defaultHref` prop to it. */}
          <IonButtons slot={"start"}>
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle size={"large"}>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={"ion-padding"}>{children}</IonContent>
    </>
  );
};

export default HomeLayout;
