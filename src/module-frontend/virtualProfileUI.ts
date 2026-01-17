import { DropResult } from "react-beautiful-dnd";
import { AppContextType } from "../AppProvider";
import { VirtualProfileCategoryAndKey, VirtualProfileChild, VirtualProfileGroup } from "../types/VirtualProfile";
import { v4 as uuidv4 } from "uuid";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as pluginConfig from "../pluginConfig.json";

export function toggleAll(
    appContext: AppContextType,
    setIsFolderCollapsed: React.Dispatch<React.SetStateAction<boolean>>
) {
    const { runtimeSyncedResources, setRuntimeSyncedResources } = appContext;

    const allCollapsed = runtimeSyncedResources.virtualProfiles.every((row) => row.isCollapsed);
    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.map((row) => ({
            ...row,
            isCollapsed: !allCollapsed,
        }))
    }));
    setIsFolderCollapsed(allCollapsed);
}

export function onDragEnd(
    result: DropResult,
    appContext: AppContextType,
) {
    const { source, destination } = result;
    if (!destination) {
        return;
    }

    const { runtimeSyncedResources, setRuntimeSyncedResources } = appContext;
    // Reordering top-level title rows
    if (
        source.droppableId === destination.droppableId &&
        source.droppableId === "all-rows"
    ) {
        const newRows = Array.from(runtimeSyncedResources.virtualProfiles);
        const [reordered] = newRows.splice(source.index, 1);
        newRows.splice(destination.index, 0, reordered);

        setRuntimeSyncedResources((prev) => ({
            ...prev,
            virtualProfiles: newRows,
        }));
        // setVirtualProfileGroups(newRows);
    }
    // Reordering within the same title row
    else if (source.droppableId === destination.droppableId) {
        const parentRow = runtimeSyncedResources.virtualProfiles.find(
            (row) => row.id === source.droppableId
        );
        if (parentRow) {
            const newChildren = Array.from(parentRow.children);
            const [reordered] = newChildren.splice(source.index, 1);
            newChildren.splice(destination.index, 0, reordered);
            const newRows = runtimeSyncedResources.virtualProfiles.map((row) => {
                if (row.id === parentRow.id) {
                    return { ...row, children: newChildren };
                }
                return row;
            });

            setRuntimeSyncedResources((prev) => ({
                ...prev,
                virtualProfiles: newRows,
            }));
            // setVirtualProfileGroups(newRows);
        }
    }
    // Moving items between different title rows
    else if (source.droppableId !== destination.droppableId) {
        const sourceRow = runtimeSyncedResources.virtualProfiles.find(
            (row) => row.id === source.droppableId
        );
        const destRow = runtimeSyncedResources.virtualProfiles.find(
            (row) => row.id === destination.droppableId
        );
        if (sourceRow && destRow) {
            const sourceChildren = Array.from(sourceRow.children);
            const destChildren = Array.from(destRow.children);
            const [removed] = sourceChildren.splice(source.index, 1);
            destChildren.splice(destination.index, 0, removed);

            const newRows = runtimeSyncedResources.virtualProfiles.map((row) => {
                if (row.id === source.droppableId) {
                    return { ...row, children: sourceChildren };
                } else if (row.id === destination.droppableId) {
                    return { ...row, children: destChildren };
                }
                return row;
            });

            setRuntimeSyncedResources((prev) => ({
                ...prev,
                virtualProfiles: newRows,
            }));
            // setVirtualProfileGroups(newRows);
        }
    }
};

// Handler to add a new title row
export function addTitleRow(
    appContext: AppContextType,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, setRuntimeSyncedResources } = appContext;

    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
                onProceed: () => addTitleRow(appContext, true),
            });
            return;
        }
    }

    const newRow: VirtualProfileGroup = {
        id: uuidv4(), // Ensure unique ID
        title: `Title`,
        children: [],
        isCollapsed: false,
    };

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: [...prev.virtualProfiles, newRow]
    }));
};

export function addRecordToLastTitle(
    appContext: AppContextType,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, runtimeSyncedResources, setRuntimeSyncedResources } = appContext;
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime, // Adjust delay time as needed
                onProceed: () => addRecordToLastTitle(appContext, true),
            });
            return;
        }
    }

    if (runtimeSyncedResources.virtualProfiles.length === 0) {
        console.warn("No title rows available to add a record");
        return;
    }

    const newRecord: VirtualProfileChild = {
        id: uuidv4(),
        content: "Example Content",
        title: "Content Title",
    };

    const newRows = [...runtimeSyncedResources.virtualProfiles];
    newRows[newRows.length - 1].children.push(newRecord);

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: newRows,
    }));
};

export function deleteRow(
    appContext: AppContextType,
    rowId: string,
    handleClose: () => void,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, setRuntimeSyncedResources } = appContext;
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime, // Adjust delay time as needed
                onProceed: () => deleteRow(appContext, rowId, handleClose, true),
            });
            return;
        }
    }

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.filter((row) => row.id !== rowId)
    }));

    handleClose();
};

export function deleteChild(
    appContext: AppContextType,
    rowId: string,
    childId: string,
    handleClose: () => void,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, setRuntimeSyncedResources } = appContext;
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
                onProceed: () => deleteChild(appContext, rowId, childId, handleClose, true),
            });
            return;
        }
    }

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.map((row) => {
            if (row.id === rowId) {
                return {
                    ...row,
                    children: row.children.filter((child) => child.id !== childId),
                };
            }
            return row;
        })
    }));

    handleClose();
};

export function addChildToRow(
    appContext: AppContextType,
    rowId: string,
    handleClose: () => void,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, setRuntimeSyncedResources, runtimeSyncedResources } = appContext;

    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime, // Adjust delay time as needed
                onProceed: () => addChildToRow(appContext, rowId, handleClose, true),
            });
            return;
        }
    }

    const newChild: VirtualProfileChild = {
        id: uuidv4(), // Generate a unique ID for the new child
        content: "Value",
        title: "Title",
    };

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: prev.virtualProfiles.map((row) => {
            if (row.id === rowId) {
                return {
                    ...row,
                    children: [...row.children, newChild], // Append the new child to the existing children array
                };
            }
            return row;
        })
    }));

    handleClose(); // Close any open context menus or modal dialogs
};

export function duplicateTitleRow(
    appContext: AppContextType,
    rowId: string,
    handleClose: () => void,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, runtimeSyncedResources, setRuntimeSyncedResources } = appContext;
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
                onProceed: () => duplicateTitleRow(appContext, rowId, handleClose, true),
            });
            return;
        }
    }

    const rowIndex = runtimeSyncedResources.virtualProfiles.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const rowToDuplicate = runtimeSyncedResources.virtualProfiles[rowIndex];
    const duplicatedRow = {
        ...rowToDuplicate,
        id: uuidv4(), // Generate a new unique ID for the duplicated row
        children: rowToDuplicate.children.map((child) => ({
            ...child,
            id: uuidv4(), // Generate unique IDs for each child in the duplicated row
        })),
    };

    const newRows = [...runtimeSyncedResources.virtualProfiles];
    newRows.splice(rowIndex + 1, 0, duplicatedRow);

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: newRows,
    }));

    handleClose(); // Close any open context menus or modals
};

export function duplicateContentRow(
    appContext: AppContextType,
    rowId: string,
    childId: string,
    handleClose: () => void,
    isRealCall = false
) {
    const { licenseManagement, setFreeUserDelayModalConfig, runtimeSyncedResources, setRuntimeSyncedResources } = appContext;
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(licenseManagement)) {
            setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime, // Adjust delay time as needed
                onProceed: () => duplicateContentRow(appContext, rowId, childId, handleClose, true),
            });
            return;
        }
    }

    const rowIndex = runtimeSyncedResources.virtualProfiles.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const childIndex = runtimeSyncedResources.virtualProfiles[rowIndex].children.findIndex(
        (child) => child.id === childId
    );
    if (childIndex === -1) return;

    const childToDuplicate =
        runtimeSyncedResources.virtualProfiles[rowIndex].children[childIndex];
    const duplicatedChild = {
        ...childToDuplicate,
        id: uuidv4(), // Generate a unique ID for the duplicated child
    };

    const newRows = [...runtimeSyncedResources.virtualProfiles];
    newRows[rowIndex].children.splice(childIndex + 1, 0, duplicatedChild);

    setRuntimeSyncedResources((prev) => ({
        ...prev,
        virtualProfiles: newRows
    }));

    handleClose();
};

export function getAvailabeCategories(): VirtualProfileCategoryAndKey[] {
    return [
        {
          category: "FLOW",
          key: "module:userFlow"
        },
        {
            category: "BOOK",
            key: "module:book",
        },
        {
            category: "CREDIT_CARD",
            key: "module:creditcard",
        },
        {
            category: "FLIGHT",
            key: "module:flight",
        },
        {
            category: "MOVIE",
            key: "module:movie",
        },
        {
            category: "PERSONAL",
            key: "module:personal",
        },
        {
            category: "PRODUCT",
            key: "module:product",
        },
        {
            category: "STOCK",
            key: "module:stock",
        },
    ]
}