import { StepType, useTour } from "@reactour/tour";
import { TourId } from "./AppTourProvider";
import { useStore } from "../../Store";
import { useIonViewDidEnter } from "@ionic/react";
import { useCallback } from "react";

/**
 * Custom React hook that initializes a Reactour tour having the specified steps.
 */
export const useAppTour = (
  tourId: TourId,
  steps: Array<StepType>,
  showOnEnter: boolean = true,
) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const { checkWhetherTourHasBeenPresented, rememberTourHasBeenPresented } =
    useStore();

  const startTour = useCallback(() => {
    if (setSteps === undefined || checkWhetherTourHasBeenPresented(tourId)) {
      return;
    }
    setSteps(steps);
    setCurrentStep(0);
    setIsOpen(true);
    rememberTourHasBeenPresented(tourId);
  }, [
    checkWhetherTourHasBeenPresented,
    rememberTourHasBeenPresented,
    setCurrentStep,
    setIsOpen,
    setSteps,
    steps,
    tourId,
  ]);

  // Show the tour "when component routing has finished animating."
  // Reference: https://ionicframework.com/docs/react/lifecycle
  useIonViewDidEnter(() => {
    // Note: I don't know the circumstances under which `setSteps` would be `undefined`,
    //       but the TypeScript type information about `useTour` says it can be.
    if (showOnEnter) {
      startTour();
    }
  }, [checkWhetherTourHasBeenPresented, startTour, tourId]);

  return { startTour };
};
