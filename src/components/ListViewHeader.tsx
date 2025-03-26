import React from 'react';

interface ListViewHeaderProps {
  additionalClass: string;
  title: string;
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
}

const ListViewHeader: React.FC<ListViewHeaderProps> = ({
  additionalClass,
  title,
  leftItem,
  rightItem
}) => {

  return (
    <div className={`list-view-header ${additionalClass}`}>
      <div>{leftItem}</div>
      <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">{title}</div>
      <div>{rightItem}</div>
    </div>
  );
};

export default ListViewHeader;
