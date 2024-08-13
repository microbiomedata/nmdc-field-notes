import { useStore } from "./Store";
import { SubmissionMetadata } from "./api";
import { useNetworkStatus } from "./NetworkStatus";

/**
 * Determine if a submission is editable by the logged-in user, taking network status into account.
 *
 * @param submission
 */
export function useIsSubmissionEditable(submission?: SubmissionMetadata) {
  const { loggedInUser } = useStore();
  const { isOnline } = useNetworkStatus();

  // If no user is logged in, the submission is not editable
  if (loggedInUser === null) {
    return false;
  }

  // If someone is logged in and is offline, there is no way they can claim the lock so just
  // assume that no one else is editing. This may result in data clobbering once this user goes
  // back online.
  if (!isOnline) {
    return true;
  }

  // If someone is logged in and is online, check to see if the lock is available or if the lock is
  // held by the logged-in user.
  return (
    submission?.locked_by === null ||
    submission?.locked_by?.id === loggedInUser.id
  );
}
