import { IonLabel } from "@ionic/react";
import React from "react";
import { useStore } from "../../Store";

const TourVisibilityManager: React.FC = () => {
  const { forgetTourHasBeenPresented } = useStore();

  const handleResetClick = () => {
    // Forget any tours have been presented.
    forgetTourHasBeenPresented(null);
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
