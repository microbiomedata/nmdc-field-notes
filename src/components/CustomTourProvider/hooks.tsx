import { StepType, useTour } from "@reactour/tour";
import { useEffect } from "react";
import { TourId } from "./CustomTourProvider";
import { useStore } from "../../Store";

/**
 * Custom React hook that initializes a Reactour tour having the specified steps.
 */
export const useLocalTour = (tourId: TourId, steps: Array<StepType>) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const { checkWhetherTourIsDismissed } = useStore();
  const isTourDismissed = checkWhetherTourIsDismissed(tourId);

  useEffect(() => {
    // Note: I don't know the circumstances under which `setSteps` would be `undefined`,
    //       but the TypeScript type information about `useTour` says it can be.
    if (setSteps !== undefined) {
      setSteps(steps);
      setCurrentStep(0);
      if (!isTourDismissed) {
        setIsOpen(true);
      }
    }
  }, [steps, setIsOpen, setSteps, setCurrentStep, isTourDismissed]);
};
