import React from "react";

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return <div className="section-title">{title}</div>;
};

export default SectionTitle;
