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
  return (
    <>
      {showCount && <>{count} </>}
      {count === 1 ? singular : plural || `${singular}s`}
    </>
  );
};

export default Pluralize;
