import React, { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./SectionHeader.module.css";

const SectionHeader: React.FC<HTMLAttributes<PropsWithChildren>> = ({
  children,
  className,
}) => {
  return (
    <div className={`${styles.header} ion-margin ${className}`}>{children}</div>
  );
};

export default SectionHeader;
