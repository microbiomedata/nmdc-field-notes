import { useHistory, useLocation } from "react-router-dom";
import { useIonViewDidEnter } from "@ionic/react";
import { produce } from "immer";

interface UseNavigationStateOptions {
  clearOnEnter?: boolean;
}

/**
 * Hook to retrieve the state from the current location.
 *
 * @template StateType The type of the state.
 * @param options Options object with the following properties:
 *   - clearOnEnter: Whether to clear the state when the view enters (default is true).
 * @returns The state from the current location.
 */
export default function useNavigationState<StateType>(
  options: UseNavigationStateOptions = {},
): StateType | undefined {
  const history = useHistory<StateType>();
  const location = useLocation<StateType | undefined>();

  const { clearOnEnter } = {
    clearOnEnter: true,
    ...options,
  };

  useIonViewDidEnter(() => {
    if (!clearOnEnter) {
      return;
    }
    if (location.state !== undefined) {
      const newLocation = produce(location, (draft) => {
        draft.state = undefined;
      });
      history.replace(newLocation);
    }
  }, [location, history, clearOnEnter]);

  return location.state;
}
