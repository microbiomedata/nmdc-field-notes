import { StepType, useTour } from "@reactour/tour";
import { TourId } from "./AppTourProvider";
import { useStore } from "../../Store";
import { useIonViewDidEnter } from "@ionic/react";

/**
 * Custom React hook that initializes a Reactour tour having the specified steps.
 */
export const useLocalTour = (tourId: TourId, steps: Array<StepType>) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const { checkWhetherTourHasBeenPresented, rememberTourHasBeenPresented } =
    useStore();

  // Show the tour "when component routing has finished animating."
  // Reference: https://ionicframework.com/docs/react/lifecycle
  useIonViewDidEnter(() => {
    // Note: I don't know the circumstances under which `setSteps` would be `undefined`,
    //       but the TypeScript type information about `useTour` says it can be.
    if (setSteps !== undefined && !checkWhetherTourHasBeenPresented(tourId)) {
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
      rememberTourHasBeenPresented(tourId);
    }
  }, [
    steps,
    setIsOpen,
    setSteps,
    setCurrentStep,
    checkWhetherTourHasBeenPresented,
    rememberTourHasBeenPresented,
    tourId,
  ]);
};
