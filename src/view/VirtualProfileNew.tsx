import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import {
  VirtualProfileChild,
  VirtualProfileGroup,
} from "../types/VirtualProfile";
import { useTranslation } from "react-i18next";

interface VirtualProfileNewProps {
  applyVirtualProfile: (key: string, value: string) => void;
  handleInputChange: (key: string, value: string) => void;
}

interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  rowId?: string;
  childId?: string;
}

const initialRows: VirtualProfileGroup[] = [
  {
    id: uuidv4(),
    title: "Title 1",
    children: [
      {
        id: uuidv4(),
        content: "Content 1-1",
        title: "content title",
      },
    ],
    isCollapsed: false,
  },
  {
    id: uuidv4(),
    title: "Title 2",
    children: [
      {
        id: uuidv4(),
        content: "Content 2-1",
        title: "content title",
      },
    ],
    isCollapsed: false,
  },
];

const VirtualProfileNew: React.FC<VirtualProfileNewProps> = ({
  applyVirtualProfile,
  handleInputChange,
}) => {
  const { t } = useTranslation(["module"]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [rows, setRows] = useState<VirtualProfileGroup[]>(initialRows);
  const menuRef = useRef<HTMLUListElement>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<string | null>(null);

  const toggleAll = () => {
    const allCollapsed = rows.every((row) => row.isCollapsed);
    setRows(rows.map((row) => ({ ...row, isCollapsed: !allCollapsed })));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.droppableId === "all-rows"
    ) {
      // Reordering top-level title rows
      const newRows = Array.from(rows);
      const [reordered] = newRows.splice(source.index, 1);
      newRows.splice(destination.index, 0, reordered);
      setRows(newRows);
    } else if (source.droppableId !== destination.droppableId) {
      // Moving items between different title rows
      const sourceRow = rows.find((row) => row.id === source.droppableId);
      const destRow = rows.find((row) => row.id === destination.droppableId);
      const sourceChildren = Array.from(sourceRow!.children);
      const destChildren = Array.from(destRow!.children);
      const [removed] = sourceChildren.splice(source.index, 1);
      destChildren.splice(destination.index, 0, removed);

      const newRows = rows.map((row) => {
        if (row.id === source.droppableId) {
          return { ...row, children: sourceChildren };
        } else if (row.id === destination.droppableId) {
          return { ...row, children: destChildren };
        }
        return row;
      });

      setRows(newRows);
    }
  };

  const toggleCollapse = useCallback((id: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isCollapsed: !row.isCollapsed } : row
      )
    );
  }, []);

  // Handler to add a new title row
  const addTitleRow = () => {
    const newRow: VirtualProfileGroup = {
      id: uuidv4(), // Ensure unique ID
      title: `Title ${rows.length + 1}`,
      children: [],
      isCollapsed: false,
    };
    setRows([...rows, newRow]);
  };

  // Handler to add a new record to the last title row
  const addRecordToLastTitle = () => {
    if (rows.length === 0) {
      console.warn("No title rows available to add a record");
      return;
    }
    const newRecord: VirtualProfileChild = {
      id: uuidv4(),
      content: "Example Content",
      title: "Content Title",
    };
    const newRows = [...rows];
    newRows[newRows.length - 1].children.push(newRecord);
    setRows(newRows);
  };

  // Inside your component
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (contextMenu && event.target instanceof Node && menuRef.current) {
        if (!menuRef.current.contains(event.target)) {
          handleClose();
        }
      }
    };

    if (contextMenu) {
      // Add event listener when context menu is open
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      // Cleanup event listener when context menu is closed or component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenu]); // Depend on contextMenu state

  const handleContextMenu = (
    event: React.MouseEvent,
    rowId: string,
    childId?: string
  ) => {
    event.preventDefault();
    const clickX = event.pageX + 20;
    const clickY = event.pageY - 40;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = 140; // Assume the width of the context menu
    const rootH = 50; // Assume the height of the context menu

    const right = screenW - clickX > rootW;
    const bottom = screenH - clickY > rootH;

    setContextMenu({
      mouseX: right ? clickX : clickX - rootW,
      mouseY: bottom ? clickY : clickY - rootH,
      rowId,
      childId,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const deleteRow = (rowId: string) => {
    setRows(rows.filter((row) => row.id !== rowId));
    handleClose();
  };

  const deleteChild = (rowId: string, childId: string) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            children: row.children.filter((child) => child.id !== childId),
          };
        }
        return row;
      })
    );
    handleClose();
  };

  const addChildToRow = (rowId: string) => {
    const newChild: VirtualProfileChild = {
      id: uuidv4(), // Generate a unique ID for the new child
      content: "Value",
      title: "Default Title",
    };

    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            children: [...row.children, newChild], // Append new child to the existing children array
          };
        }
        return row;
      })
    );

    handleClose(); // Close any open context menus or modal dialogs
  };

  const duplicateTitleRow = (rowId: string) => {
    const rowIndex = rows.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const rowToDuplicate = rows[rowIndex];
    const duplicatedRow = {
      ...rowToDuplicate,
      id: uuidv4(), // Ensure a unique ID
      children: rowToDuplicate.children.map((child) => ({
        ...child,
        id: uuidv4(), // Ensuring unique ID for children
      })),
    };

    const newRows = [...rows];
    newRows.splice(rowIndex + 1, 0, duplicatedRow);
    setRows(newRows);
    handleClose();
  };

  const duplicateContentRow = (rowId: string, childId: string) => {
    const rowIndex = rows.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const childIndex = rows[rowIndex].children.findIndex(
      (child) => child.id === childId
    );
    if (childIndex === -1) return;

    const childToDuplicate = rows[rowIndex].children[childIndex];
    const duplicatedChild = {
      ...childToDuplicate,
      id: uuidv4(), // Ensure a unique ID
    };

    const newRows = [...rows];
    newRows[rowIndex].children.splice(childIndex + 1, 0, duplicatedChild);
    setRows(newRows);
    handleClose();
  };

  // Inside your component render method where the context menu is defined
  const renderContextMenu = () => {
    if (!contextMenu) return null;
    const { mouseX, mouseY, rowId, childId } = contextMenu;

    if (!rowId) return;

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
          <li onClick={() => addChildToRow(rowId)}>Add Item</li>
        )}
        <li
          onClick={() =>
            childId
              ? duplicateContentRow(rowId, childId)
              : duplicateTitleRow(rowId)
          }
        >
          Duplicate
        </li>
        {childId ? (
          <li onClick={() => deleteChild(rowId!, childId)}>Delete Item</li>
        ) : (
          <li onClick={() => deleteRow(rowId!)}>Delete Group</li>
        )}
      </ul>
    );
  };

  return (
    <div>
      {renderContextMenu()}
      <DragDropContext onDragEnd={onDragEnd}>
        <button onClick={toggleAll}>Toggle All</button>
        <button onClick={addTitleRow}>Add Title Row</button>
        <button onClick={addRecordToLastTitle}>
          Add Record to Last Title Row
        </button>
        <Droppable droppableId="all-rows" type="row">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tableContainer"
            >
              {rows.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                      className="row"
                    >
                      <div
                        className="row-header"
                        onContextMenu={(e) => handleContextMenu(e, row.id)}
                      >
                        <span
                          className={`arrowIcon ${
                            row.isCollapsed ? "collapsed" : "expanded"
                          }`}
                          onClick={() => toggleCollapse(row.id)}
                        >
                          ➤
                        </span>
                        {row.title}

                        <div
                          {...provided.dragHandleProps}
                          className="dragHandle"
                        >
                          &#9776; {/* Hamburger icon */}
                        </div>
                      </div>

                      <Droppable droppableId={row.id} type="child">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              display: row.isCollapsed ? "none" : "block",
                            }}
                            className={
                              row.isCollapsed
                                ? "rowContent"
                                : "rowContent visible"
                            }
                          >
                            {row.children.map((child, childIndex) => (
                              <Draggable
                                key={child.id}
                                draggableId={child.id}
                                index={childIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    //{...provided.dragHandleProps}
                                    className="row-child"
                                    onContextMenu={(e) =>
                                      handleContextMenu(e, row.id, child.id)
                                    }
                                    onMouseEnter={() =>
                                      setHoveredRowIndex(child.id)
                                    }
                                    onMouseLeave={() =>
                                      setHoveredRowIndex(null)
                                    }
                                  >
                                    <div>
                                      {hoveredRowIndex === child.id && (
                                        <button
                                          onClick={() =>
                                            applyVirtualProfile(
                                              child.id,
                                              child.content
                                            )
                                          }
                                        >
                                          {t("module:apply")}
                                        </button>
                                      )}
                                    </div>
                                    <div className="virtual-profile-title">
                                      {child.title}
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={child.content}
                                        onChange={(e) =>
                                          handleInputChange(
                                            child.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div
                                      {...provided.dragHandleProps}
                                      className="dragHandle"
                                    >
                                      &#9776;
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default VirtualProfileNew;
