import React, { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./SectionHeader.module.css";

export enum Variant {
  Default, // receives default styling
  WithinListHeader, // receives custom styling that compensates for `<IonListHeader>` styling
}

interface Props extends HTMLAttributes<PropsWithChildren> {
  /** Which variant of the component you want to render (variants are styled differently from one another). */
  variant?: Variant;
}

const SectionHeader: React.FC<Props> = ({
  children,
  className,
  variant = Variant.Default,
}) => {
  // Customize the `className` value based upon the specified variant.
  let classNameVal = `${styles.header} ion-margin ${className}`;
  if (variant === Variant.WithinListHeader) {
    classNameVal = `${styles.header} ${styles.withinListHeader} ${className}`;
  }

  return <div className={classNameVal}>{children}</div>;
};

export default SectionHeader;
