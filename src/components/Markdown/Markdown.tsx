import React from "react";
import SectionHeader, { Variant } from "../SectionHeader/SectionHeader";
import ReactMarkdown from "react-markdown";

import styles from "./Markdown.module.css";

interface MarkdownProps {
  /** The markdown content to render. */
  children: string;

  /** A CSS class name to apply to the container element */
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  return (
    <ReactMarkdown
      className={`ion-padding ${styles.markdown} ${className}`}
      components={{
        h1: ({ children }) => (
          <SectionHeader variant={Variant.NoMargin}>{children}</SectionHeader>
        ),
        blockquote: ({ children }) => (
          <blockquote className={styles.blockquote}>{children}</blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
