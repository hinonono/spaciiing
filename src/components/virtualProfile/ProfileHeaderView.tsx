import React from 'react';
import { VirtualProfileGroup } from '../../types/VirtualProfile';
import { SvgChevronLeft, SvgDragHandle } from '../../assets/icons';
import { DraggableProvided } from 'react-beautiful-dnd';

interface ProfileHeaderViewProps {
  provided: DraggableProvided;
  row: VirtualProfileGroup;
  handleContextMenu: (e: React.MouseEvent) => void;
  toggleCollapse: () => void;
  handleGroupTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeaderView: React.FC<ProfileHeaderViewProps> = ({
  provided,
  row,
  handleContextMenu,
  toggleCollapse,
  handleGroupTitleChange
}) => {

  return (
    <div
      className="cy-table-group-header"
      onContextMenu={handleContextMenu}
    >
      <div
        className={`arrowIcon ${row.isCollapsed ? "collapsed" : "expanded"
          } icon-16`}
        onClick={toggleCollapse}
      >
        <SvgChevronLeft color="var(--figma-color-text)" />
      </div>
      <div>
        <input
          className="cy-input font-weight-bold"
          type="text"
          value={row.title}
          onChange={handleGroupTitleChange}
        />
      </div>
      <div
        {...provided.dragHandleProps}
        className="dragHandle"
      >
        <div className="icon-16">
          <SvgDragHandle color="var(--figma-color-text-secondary)" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderView;
