import React, { PropsWithChildren } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import ErrorBanner from "../ErrorBanner/ErrorBanner";

interface QueryErrorBannerProps extends PropsWithChildren {
  query: UseQueryResult;
}

const QueryErrorBanner: React.FC<QueryErrorBannerProps> = ({
  query,
  children,
}) => {
  if (query.fetchStatus !== "idle" || query.status !== "error") {
    return null;
  }

  return <ErrorBanner error={query.error}>{children}</ErrorBanner>;
};

export default QueryErrorBanner;
