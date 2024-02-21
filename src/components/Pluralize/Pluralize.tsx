import React from "react";

interface PluralizeProps {
  count: number;
  singular: string;
  plural?: string;
  showCount?: boolean;
}

const Pluralize: React.FC<PluralizeProps> = ({
  count,
  singular,
  plural,
  showCount,
}) => {
  const pluralDisplay = plural || `${singular}s`;
  return (
    <>
      {/* Extra space is intentional to separate the count from the word */}
      {showCount && <>{count} </>}
      {count === 1 ? singular : pluralDisplay}
    </>
  );
};

export default Pluralize;
