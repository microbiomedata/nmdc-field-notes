import { IonLabel, useIonToast } from "@ionic/react";
import React from "react";
import { useStore } from "../../Store";
import { checkmark } from "ionicons/icons";

const TourVisibilityManager: React.FC = () => {
  const { forgetTourHasBeenPresented } = useStore();
  const [present] = useIonToast();

  const handleResetClick = () => {
    // Forget that any tours have been presented.
    forgetTourHasBeenPresented(null);

    // Display a toast notification.
    void present({
      message: "Tours reset",
      duration: 3000,
      icon: checkmark,
    });
  };

  return (
    <>
      <IonLabel onClick={handleResetClick} color={"primary"}>
        <h3>Reset tours</h3>
        <p>Make the on-screen tours show up again</p>
      </IonLabel>
    </>
  );
};

export default TourVisibilityManager;
