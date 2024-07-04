import React from "react";

interface SectionTitleProps {
  title: string;
  actionTitle?: string;
  action?: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  action,
  actionTitle,
}) => {
  return (
    <div className="section-title">
      <span>{title}</span>
      {actionTitle && (
        <button onClick={action} className="plain-text-button">{actionTitle}</button>
      )}
    </div>
  );
};

export default SectionTitle;
