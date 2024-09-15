import { StepType, useTour } from "@reactour/tour";
import { useEffect } from "react";

/**
 * Custom React hook that initializes a Reactour tour having the specified steps.
 */
export const useLocalTour = (steps: Array<StepType>) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  useEffect(() => {
    // Note: I don't know the circumstances under which `setSteps` would be `undefined`,
    //       but the TypeScript type information about `useTour` says it can be.
    if (setSteps !== undefined) {
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [steps, setIsOpen, setSteps, setCurrentStep]);
};
