import React, { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./SectionHeader.module.css";

export enum Variant {
  Default, // receives default styling
  WithinListHeader, // receives custom styling that compensates for `<IonListHeader>` styling
  NoMargin, // receives no margin
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
  const classNameSet = new Set([styles.header]);
  if (className) {
    classNameSet.add(className);
  }
  if (variant === Variant.Default) {
    classNameSet.add("ion-margin");
  } else if (variant === Variant.WithinListHeader) {
    classNameSet.add(styles.withinListHeader);
  } else if (variant === Variant.NoMargin) {
    classNameSet.add("ion-no-margin");
  }

  return <div className={[...classNameSet].join(" ")}>{children}</div>;
};

export default SectionHeader;
