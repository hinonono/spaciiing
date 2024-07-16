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
  VirtualProfileGroupRaw,
} from "../types/VirtualProfile";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import { SvgHorizontal } from "../assets/icons";

import vpdata_financial from "../assets/virtual-profile/financial.json";
import vpdata_personal from "../assets/virtual-profile/personal.json";
import { transformJsonToGroup } from "../module-frontend/virtualProfileFrontEnd";
import { resolveContextMenuPos } from "../module-frontend/utilFrontEnd";

interface VirtualProfileNewProps {
  applyVirtualProfile: (key: string, value: string) => void;
}

interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  rowId?: string;
  childId?: string;
}

const VirtualProfileNew: React.FC<VirtualProfileNewProps> = ({
  applyVirtualProfile,
}) => {
  const { t } = useTranslation(["module"]);

  //Context
  const { virtualProfileGroups, setVirtualProfileGroups } = useAppContext();

  //

  const handleInputChange = (
    groupId: string,
    childId: string,
    value: string,
    type: "CONTENT" | "TITLE"
  ) => {
    console.log(value);

    if (type == "CONTENT") {
      setVirtualProfileGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              children: group.children.map((child) => {
                if (child.id === childId) {
                  return { ...child, content: value };
                }
                return child;
              }),
            };
          }
          return group;
        })
      );
    } else {
      setVirtualProfileGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              children: group.children.map((child) => {
                if (child.id === childId) {
                  return { ...child, title: value };
                }
                return child;
              }),
            };
          }
          return group;
        })
      );
    }
  };

  const handleGroupTitleChange = (groupId: string, value: string) => {
    setVirtualProfileGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            title: value,
          };
        }
        return group;
      })
    );
  };

  //
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [additionalContextMenu, setAdditionalContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const additionalMenuRef = useRef<HTMLUListElement>(null);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<string | null>(null);

  const toggleAll = () => {
    const allCollapsed = virtualProfileGroups.every((row) => row.isCollapsed);
    setVirtualProfileGroups(
      virtualProfileGroups.map((row) => ({
        ...row,
        isCollapsed: !allCollapsed,
      }))
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    console.log({ source, destination });

    // Reordering top-level title rows
    if (
      source.droppableId === destination.droppableId &&
      source.droppableId === "all-rows"
    ) {
      const newRows = Array.from(virtualProfileGroups);
      const [reordered] = newRows.splice(source.index, 1);
      newRows.splice(destination.index, 0, reordered);
      setVirtualProfileGroups(newRows);
    }
    // Reordering within the same title row
    else if (source.droppableId === destination.droppableId) {
      const parentRow = virtualProfileGroups.find(
        (row) => row.id === source.droppableId
      );
      if (parentRow) {
        const newChildren = Array.from(parentRow.children);
        const [reordered] = newChildren.splice(source.index, 1);
        newChildren.splice(destination.index, 0, reordered);
        const newRows = virtualProfileGroups.map((row) => {
          if (row.id === parentRow.id) {
            return { ...row, children: newChildren };
          }
          return row;
        });
        setVirtualProfileGroups(newRows);
      }
    }
    // Moving items between different title rows
    else if (source.droppableId !== destination.droppableId) {
      const sourceRow = virtualProfileGroups.find(
        (row) => row.id === source.droppableId
      );
      const destRow = virtualProfileGroups.find(
        (row) => row.id === destination.droppableId
      );
      if (sourceRow && destRow) {
        const sourceChildren = Array.from(sourceRow.children);
        const destChildren = Array.from(destRow.children);
        const [removed] = sourceChildren.splice(source.index, 1);
        destChildren.splice(destination.index, 0, removed);

        const newRows = virtualProfileGroups.map((row) => {
          if (row.id === source.droppableId) {
            return { ...row, children: sourceChildren };
          } else if (row.id === destination.droppableId) {
            return { ...row, children: destChildren };
          }
          return row;
        });

        setVirtualProfileGroups(newRows);
      }
    }
  };

  const toggleCollapse = useCallback((id: string) => {
    setVirtualProfileGroups((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isCollapsed: !row.isCollapsed } : row
      )
    );
  }, []);

  // Handler to add a new title row
  const addTitleRow = () => {
    const newRow: VirtualProfileGroup = {
      id: uuidv4(), // Ensure unique ID
      title: `Title`,
      children: [],
      isCollapsed: false,
    };
    setVirtualProfileGroups([...virtualProfileGroups, newRow]);
    // setVirtualProfileGroups(rows);
  };

  // Handler to add a new record to the last title row
  const addRecordToLastTitle = () => {
    if (virtualProfileGroups.length === 0) {
      console.warn("No title rows available to add a record");
      return;
    }
    const newRecord: VirtualProfileChild = {
      id: uuidv4(),
      content: "Example Content",
      title: "Content Title",
    };
    const newRows = [...virtualProfileGroups];
    newRows[newRows.length - 1].children.push(newRecord);
    setVirtualProfileGroups(newRows);
    setVirtualProfileGroups(virtualProfileGroups);
  };

  // Inside your component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenu &&
        event.target instanceof Node &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setContextMenu(null);
      }
      if (
        additionalContextMenu &&
        event.target instanceof Node &&
        additionalMenuRef.current &&
        !additionalMenuRef.current.contains(event.target)
      ) {
        setAdditionalContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu, additionalContextMenu]);

  const handleContextMenu = (
    event: React.MouseEvent,
    rowId: string,
    childId?: string
  ) => {
    event.preventDefault();
    if (!containerRef.current) {
      return;
    }

    const { left, top } = resolveContextMenuPos(
      event.clientX,
      event.clientY,
      containerRef.current.getBoundingClientRect()
    );

    setContextMenu({
      mouseX: left,
      mouseY: top,
      rowId,
      childId,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const deleteRow = (rowId: string) => {
    setVirtualProfileGroups(
      virtualProfileGroups.filter((row) => row.id !== rowId)
    );
    // setVirtualProfileGroups(rows);
    handleClose();
  };

  const deleteChild = (rowId: string, childId: string) => {
    setVirtualProfileGroups(
      virtualProfileGroups.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            children: row.children.filter((child) => child.id !== childId),
          };
        }
        return row;
      })
    );
    // setVirtualProfileGroups(rows);
    handleClose();
  };

  const addChildToRow = (rowId: string) => {
    const newChild: VirtualProfileChild = {
      id: uuidv4(), // Generate a unique ID for the new child
      content: "Value",
      title: "Title",
    };

    setVirtualProfileGroups(
      virtualProfileGroups.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            children: [...row.children, newChild], // Append new child to the existing children array
          };
        }
        return row;
      })
    );
    // setVirtualProfileGroups(rows);
    handleClose(); // Close any open context menus or modal dialogs
  };

  const duplicateTitleRow = (rowId: string) => {
    const rowIndex = virtualProfileGroups.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const rowToDuplicate = virtualProfileGroups[rowIndex];
    const duplicatedRow = {
      ...rowToDuplicate,
      id: uuidv4(), // Ensure a unique ID
      children: rowToDuplicate.children.map((child) => ({
        ...child,
        id: uuidv4(), // Ensuring unique ID for children
      })),
    };

    const newRows = [...virtualProfileGroups];
    newRows.splice(rowIndex + 1, 0, duplicatedRow);
    setVirtualProfileGroups(newRows);
    // setVirtualProfileGroups(rows);
    handleClose();
  };

  const duplicateContentRow = (rowId: string, childId: string) => {
    const rowIndex = virtualProfileGroups.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const childIndex = virtualProfileGroups[rowIndex].children.findIndex(
      (child) => child.id === childId
    );
    if (childIndex === -1) return;

    const childToDuplicate =
      virtualProfileGroups[rowIndex].children[childIndex];
    const duplicatedChild = {
      ...childToDuplicate,
      id: uuidv4(), // Ensure a unique ID
    };

    const newRows = [...virtualProfileGroups];
    newRows[rowIndex].children.splice(childIndex + 1, 0, duplicatedChild);
    setVirtualProfileGroups(newRows);
    // setVirtualProfileGroups(rows);
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
        {!childId && <li onClick={() => addChildToRow(rowId)}>Add Item</li>}
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

  const handleAdditionalContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!containerRef.current) return;
    const { left, top } = resolveContextMenuPos(
      event.clientX,
      event.clientY,
      containerRef.current.getBoundingClientRect()
    );

    setAdditionalContextMenu({
      mouseX: left,
      mouseY: top,
    });
  };

  const createNewGroupFromJsonData = (data: VirtualProfileGroupRaw) => {
    setVirtualProfileGroups((prevGroups) => [
      ...prevGroups,
      transformJsonToGroup(data),
    ]);
  };

  const renderAdditionalContextMenu = () => {
    if (!additionalContextMenu) return null;
    const { mouseX, mouseY } = additionalContextMenu;

    return (
      <ul
        ref={additionalMenuRef}
        style={{
          position: "absolute",
          top: mouseY,
          left: mouseX,
          zIndex: 1000,
        }}
        className="context-menu"
      >
        <li
          onClick={() => {
            createNewGroupFromJsonData(vpdata_personal);
            setAdditionalContextMenu(null);
          }}
        >
          {t("module:personal")}
        </li>
        <li
          onClick={() => {
            createNewGroupFromJsonData(vpdata_financial);
            setAdditionalContextMenu(null);
          }}
        >
          {t("module:financial")}
        </li>
      </ul>
    );
  };

  // Function to transform JSON data to VirtualProfileGroup

  return (
    <div ref={containerRef} className="position-relative">
      {renderContextMenu()}
      {renderAdditionalContextMenu()}
      <DragDropContext onDragEnd={onDragEnd}>
        <button onClick={toggleAll}>Toggle All</button>
        <button onClick={addTitleRow}>Add Title Row</button>
        <button onClick={addRecordToLastTitle}>
          Add Record to Last Title Row
        </button>
        <button onClick={(e) => handleAdditionalContextMenu(e)}>
          More Options
        </button>
        <Droppable droppableId="all-rows" type="row">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tableContainer"
            >
              {virtualProfileGroups.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`cy-table-group ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                    >
                      <div
                        className="cy-table-group-header"
                        onContextMenu={(e) => handleContextMenu(e, row.id)}
                      >
                        <div
                          className={`arrowIcon ${
                            row.isCollapsed ? "collapsed" : "expanded"
                          } icon-24`}
                          onClick={() => toggleCollapse(row.id)}
                        >
                          <SvgHorizontal color="var(--figma-color-text)" />
                        </div>
                        <div>
                          <input
                            className="cy-input text-center"
                            type="text"
                            value={row.title}
                            onChange={(e) =>
                              handleGroupTitleChange(row.id, e.target.value)
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
                                ? "cy-table-rows-wrapper"
                                : "cy-table-rows-wrapper visible"
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
                                    className="cy-table-row-child"
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
                                          className="button--grain"
                                        >
                                          {t("module:apply")}
                                        </button>
                                      )}
                                    </div>
                                    <div className="text-color-secondary pl-xxxsmall pr-xxxsmall">
                                      <input
                                        className="cy-input"
                                        type="text"
                                        value={child.title}
                                        onChange={(e) =>
                                          handleInputChange(
                                            row.id,
                                            child.id,
                                            e.target.value,
                                            "TITLE"
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pl-xxxsmall pr-xxxsmall">
                                      <input
                                        className="cy-input"
                                        type="text"
                                        value={child.content}
                                        onChange={(e) =>
                                          handleInputChange(
                                            row.id,
                                            child.id,
                                            e.target.value,
                                            "CONTENT"
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
