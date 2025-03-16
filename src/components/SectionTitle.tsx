import React from "react";

interface SectionTitleProps {
  title: string;
  actionTitle?: string;
  action?: () => void;
  titleType?: "primary" | "secondary";
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  action,
  actionTitle,
  titleType = "primary",
}) => {
  return (
    <div className={`section-title section-title-${titleType}`}>
      <span>{title}</span>
      {actionTitle && (
        <button onClick={action} className="plain-text-button">{actionTitle}</button>
      )}
    </div>
  );
};

export default SectionTitle;
