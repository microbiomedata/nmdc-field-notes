import { useHistory } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook to navigate to a new URL with state.
 *
 * See also: useNavigationState to retrieve the state after navigating.
 *
 * @template StateType The type of the state.
 * @returns A function to navigate to a new URL with state. The function accepts the URL as a
 * string, the state, and a boolean indicating whether to replace the current entry in the history
 * stack (default is false).
 */
export default function useNavigateWithState<StateType>() {
  const history = useHistory<StateType>();

  const navigate = useCallback(
    (url: string, state: StateType, replace: boolean = false) => {
      if (replace) {
        history.replace(url, state);
      } else {
        history.push(url, state);
      }
    },
    [history],
  );

  return navigate;
}
