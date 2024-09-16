import { StepType, useTour } from "@reactour/tour";
import { useEffect } from "react";
import { TourId } from "./CustomTourProvider";
import { useStore } from "../../Store";

/**
 * Custom React hook that initializes a Reactour tour having the specified steps.
 */
export const useLocalTour = (tourId: TourId, steps: Array<StepType>) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const { checkWhetherTourHasBeenPresented, rememberTourHasBeenPresented } =
    useStore();

  useEffect(() => {
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
