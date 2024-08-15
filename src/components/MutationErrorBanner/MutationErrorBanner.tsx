import React, { PropsWithChildren } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import ErrorBanner from "../ErrorBanner/ErrorBanner";

interface MutationErrorBannerProps extends PropsWithChildren {
  // Not clear why the `any` can't be replaced by `unknown` here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<unknown, Error, any, unknown>;
}

const MutationErrorBanner: React.FC<MutationErrorBannerProps> = ({
  mutation,
  children,
}) => {
  if (mutation.status !== "error") {
    return null;
  }

  return <ErrorBanner error={mutation.error}>{children}</ErrorBanner>;
};

export default MutationErrorBanner;
