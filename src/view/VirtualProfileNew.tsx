import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import {
  SupportedPresetVirtualProfileCategory,
  VirtualProfileGroup,
} from "../types/VirtualProfile";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import {
  SvgAdd,
  SvgAddFolder,
  SvgAddFromPreset,
  SvgExpand,
  SvgCollapse,
  SvgChevronLeft,
  SvgDragHandle,
  SvgSave,
} from "../assets/icons";

import { transformJsonToGroup } from "../module-frontend/virtualProfileFrontEnd";
import {
  checkProFeatureAccessibleForUser,
  resolveContextMenuPos,
} from "../module-frontend/utilFrontEnd";
import { SupportedLangCode } from "../types/Localization";
import * as pluginConfig from "../pluginConfig.json";
import { addChildToRow, addRecordToLastTitle, addTitleRow, deleteChild, deleteRow, duplicateContentRow, duplicateTitleRow, getAvailabeCategories, onDragEnd, toggleAll } from "../module-frontend/virtualProfileUI";
import { ButtonIcon24 } from "../components";

interface VirtualProfileNewProps {
  applyVirtualProfile: (key: string, value: string) => void;
  saveVirtualProfile: () => void;
  previousVirtualProfile: VirtualProfileGroup[] | null;
}

interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  rowId?: string;
  childId?: string;
}

const VirtualProfileNew: React.FC<VirtualProfileNewProps> = ({
  applyVirtualProfile,
  saveVirtualProfile,
  previousVirtualProfile,
}) => {
  const { i18n, t } = useTranslation(["module"]);

  //Context
  const appContext = useAppContext();
  const { runtimeSyncedResources, setRuntimeSyncedResources, licenseManagement, setFreeUserDelayModalConfig } = appContext;

  //
  const [isFolderCollapsed, setIsFolderCollapsed] = useState(false);

  useEffect(() => {
    setIsFolderCollapsed(!runtimeSyncedResources.virtualProfiles.every((row) => row.isCollapsed));
  }, [runtimeSyncedResources.virtualProfiles]);

  const handleInputChange = (
    groupId: string,
    childId: string,
    value: string,
    type: "CONTENT" | "TITLE"
  ) => {
    console.log(value);

    if (type == "CONTENT") {
      setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.map((group) => {
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
        }),
      }));
    } else {
      setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.map((group) => {
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
      }));
    }
  };

  const handleGroupTitleChange = (groupId: string, value: string) => {
    setRuntimeSyncedResources((prev) => ({
      ...prev,
      virtualProfiles: prev.virtualProfiles.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            title: value,
          };
        }
        return group;
      })
    }));
  };

  //
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [additionalContextMenu, setAdditionalContextMenu] = useState<{ mouseX: number; mouseY: number; } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const additionalMenuRef = useRef<HTMLUListElement>(null);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<string | null>(null);

  const toggleCollapse = useCallback((id: string) => {
    setRuntimeSyncedResources((prev) => ({
      ...prev,
      virtualProfiles: prev.virtualProfiles.map((row) =>
        row.id === id ? { ...row, isCollapsed: !row.isCollapsed } : row
      )
    }));
  }, []);

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
          <li onClick={() => { addChildToRow(appContext, rowId, handleClose, false) }}>{t("module:addItem")}</li>
        )}
        <li
          onClick={() =>
            childId
              ? duplicateContentRow(appContext, rowId, childId, handleClose, false)
              : duplicateTitleRow(appContext, rowId, handleClose, false)
          }
        >
          {t("module:duplicate")}
        </li>
        {childId ? (
          <>
            <hr />
            <li className="destructive" onClick={() => { deleteChild(appContext, rowId!, childId, handleClose, false) }}>
              {t("module:delete")}
            </li>
          </>
        ) : (
          <>
            <hr />
            <li className="destructive" onClick={() => deleteRow(appContext, rowId!, handleClose, false)}>{t("module:delete")}</li>
          </>
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

  const createNewGroupFromJsonData = (
    category: SupportedPresetVirtualProfileCategory,
    isRealCall = false
  ) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => createNewGroupFromJsonData(category, true),
        });
        return;
      }
    }

    const newGroup = transformJsonToGroup(
      category,
      i18n.language as SupportedLangCode
    );

    if (newGroup) {

      setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: [...prev.virtualProfiles, newGroup]
      }));
    }
  };

  const renderAdditionalContextMenu = () => {
    if (!additionalContextMenu) return null;
    const { mouseX, mouseY } = additionalContextMenu;

    const categories = getAvailabeCategories();

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
        {categories.map((item) => (
          <li
            key={item.category}
            onClick={() => {
              createNewGroupFromJsonData(item.category);
              setAdditionalContextMenu(null);
            }}
          >
            {t(item.key)}
          </li>
        ))}
      </ul>
    );
  };

  const btnColor = "var(--figma-color-bg-brand)";
  const btnColorDisabled = "var(--figma-color-text-disabled)"

  const renderToolButtons = () => {
    const toolBtns: { disabled?: boolean, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void, svg: React.ReactNode }[] = [
      {
        disabled: runtimeSyncedResources.virtualProfiles == previousVirtualProfile ? true : false,
        onClick: saveVirtualProfile,
        svg: <SvgSave color={runtimeSyncedResources.virtualProfiles == previousVirtualProfile ? btnColorDisabled : btnColor} />
      },
      {
        onClick: (e) => handleAdditionalContextMenu(e),
        svg: <SvgAddFromPreset color={btnColor} />
      },
      {
        onClick: () => { addTitleRow(appContext, false) },
        svg: <SvgAddFolder color={btnColor} />,
      },
      {
        onClick: () => { addRecordToLastTitle(appContext, false) },
        svg: <SvgAdd color={btnColor} />
      }
    ]

    return (toolBtns.map(btn =>
      <ButtonIcon24
        disabled={btn.disabled}
        onClick={btn.onClick}
        svg={btn.svg}
      />
    ))
  };

  const toolbarRefLeft = useRef<HTMLDivElement>(null);
  const toolbarRefRight = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const toolbars = [toolbarRefLeft.current, toolbarRefRight.current].filter(
      Boolean
    ) as HTMLDivElement[];

    const observer = new IntersectionObserver(
      ([entry]) => {
        toolbars.forEach((el) => {
          el.classList.toggle("is-sticky", !entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="position-relative">
      {renderContextMenu()}
      {renderAdditionalContextMenu()}
      <DragDropContext onDragEnd={(result) => { onDragEnd(result, appContext) }}>
        <div ref={sentinelRef} className="sticky-sentinel" />
        <div className="flex flex-justify-space-between virtual-profile-toolbar-container">
          <div ref={toolbarRefLeft} className="virtual-profile-toolbar">
            <ButtonIcon24
              onClick={() => { toggleAll(appContext, setIsFolderCollapsed) }}
              svg={!isFolderCollapsed ? (<SvgExpand color={btnColor} />) : (<SvgCollapse color={btnColor} />)}
            />
          </div>
          <div ref={toolbarRefRight} className="flex flex-row virtual-profile-toolbar">{renderToolButtons()}</div>
        </div>
        <Droppable droppableId="all-rows" type="row">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tableContainer"
            >
              {runtimeSyncedResources.virtualProfiles.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`cy-table-group ${snapshot.isDragging ? "dragging" : ""
                        }`}
                    >
                      <div
                        className="cy-table-group-header"
                        onContextMenu={(e) => handleContextMenu(e, row.id)}
                      >
                        <div
                          className={`arrowIcon ${row.isCollapsed ? "collapsed" : "expanded"
                            } icon-16`}
                          onClick={() => toggleCollapse(row.id)}
                        >
                          <SvgChevronLeft color="var(--figma-color-text)" />
                        </div>
                        <div>
                          <input
                            className="cy-input font-weight-bold"
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
                          <div className="icon-16">
                            <SvgDragHandle color="var(--figma-color-text-secondary)" />
                          </div>
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
                                ? `cy-table-rows-wrapper`
                                : `cy-table-rows-wrapper visible ${row.children.length === 0 ? "nothing-inside" : ""}`
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
                                    <div {...provided.dragHandleProps} className="dragHandle"     >
                                      <div className="icon-16"><SvgDragHandle color={"var(--figma-color-text-secondary)"} /> </div>
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
