import React from 'react';
import { useTranslation } from 'react-i18next';
import { VirtualProfileGroupColor } from '../../types/VirtualProfile';

interface ContextMenuViewProps {
  menuRef: React.RefObject<HTMLUListElement>;
  mouseX: number;
  mouseY: number;
  rowId: string;
  childId?: string;
  addChildToRow: () => void;
  duplicateContentRow: () => void;
  duplicateTitleRow: () => void;
  deleteChild: () => void;
  deleteRow: () => void;
  setGroupColor: (value: VirtualProfileGroupColor, rowId: string) => void;
}

const ContextMenuView: React.FC<ContextMenuViewProps> = ({
  menuRef,
  mouseX,
  mouseY,
  childId,
  rowId,
  addChildToRow,
  duplicateContentRow,
  duplicateTitleRow,
  deleteChild,
  deleteRow,
  setGroupColor
}) => {
  const { t } = useTranslation(["module"]);

  const availableColors: VirtualProfileGroupColor[] = [
    "red",
    "yellow",
    "green",
    "blue",
    "cyan",
    "indigo",
    "purple",
    "gray"
  ]

  return (
    <ul
      ref={menuRef}
      style={{
        position: "absolute",
        top: mouseY,
        left: mouseX,
        zIndex: 1000,
      }}
      className="context-menu"
    >
      {!childId && (
        <div className='virtual-profile-group-colors-wrapper'>
          {availableColors.map((color) => (
            <li
              key={color}
              onClick={() => setGroupColor(color, rowId)}
              className={color}
            >
            </li>
          ))}
        </div>
      )}
      {!childId && (
        <>
          <hr />
          <li onClick={addChildToRow}>
            {t("module:addItem")}
          </li>
        </>
      )}
      <li onClick={() => childId ? duplicateContentRow() : duplicateTitleRow()} >{t("module:duplicate")}</li>
      {childId ? (
        <>
          <hr />
          <li className="destructive" onClick={deleteChild}>{t("module:delete")}</li>
        </>
      ) : (
        <>
          <hr />
          <li className="destructive" onClick={deleteRow}>{t("module:delete")}</li>
        </>
      )}
    </ul>
  );
};

export default ContextMenuView;
