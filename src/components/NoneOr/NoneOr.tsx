import React, { PropsWithChildren } from "react";

interface NoneOrProps extends PropsWithChildren {
  showPlaceholder?: boolean;
  placeholder?: string;
}

const NoneOr: React.FC<NoneOrProps> = ({
  children,
  showPlaceholder,
  placeholder = "None",
}) => {
  if (showPlaceholder === undefined) {
    showPlaceholder = !children;
  }
  return showPlaceholder ? <i>{placeholder}</i> : children;
};

export default NoneOr;
