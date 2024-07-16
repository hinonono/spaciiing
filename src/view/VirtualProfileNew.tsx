import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface VirtualProfileNewProps {}

interface TableRowData {
  id: string;
  title: string;
  children: Array<{
    id: string;
    content: string;
  }>;
  isCollapsed: boolean;
}

const initialRows: TableRowData[] = [
  {
    id: "row-1",
    title: "Title 1",
    children: [{ id: "child-1-1", content: "Content 1-1" }],
    isCollapsed: true,
  },
  {
    id: "row-2",
    title: "Title 2",
    children: [{ id: "child-2-1", content: "Content 2-1" }],
    isCollapsed: true,
  },
];

const VirtualProfileNew: React.FC<VirtualProfileNewProps> = () => {
  const [rows, setRows] = useState<TableRowData[]>(initialRows);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sourceParentId = source.droppableId;
    const destParentId = destination.droppableId;

    if (sourceParentId === destParentId) {
      // Moving items within the same parent
      const row = rows.find((row) => row.id === sourceParentId);
      const reorderedChildren = Array.from(row!.children);
      const [removed] = reorderedChildren.splice(source.index, 1);
      reorderedChildren.splice(destination.index, 0, removed);
      const newRows = rows.map((row) =>
        row.id === sourceParentId
          ? { ...row, children: reorderedChildren }
          : row
      );
      setRows(newRows);
    } else {
      // Moving items between different parents
      const sourceRow = rows.find((row) => row.id === sourceParentId);
      const destRow = rows.find((row) => row.id === destParentId);
      const sourceChildren = Array.from(sourceRow!.children);
      const destChildren = Array.from(destRow!.children);
      const [removed] = sourceChildren.splice(source.index, 1);
      destChildren.splice(destination.index, 0, removed);

      const newRows = rows.map((row) => {
        if (row.id === sourceParentId) {
          return { ...row, children: sourceChildren };
        } else if (row.id === destParentId) {
          return { ...row, children: destChildren };
        }
        return row;
      });

      setRows(newRows);
    }
  };

  const toggleCollapse = (id: string) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, isCollapsed: !row.isCollapsed };
      }
      return row;
    });
    setRows(newRows);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {rows.map((row, rowIndex) => (
        <Droppable key={row.id} droppableId={row.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="tableContainer"
            >
              <div onClick={() => toggleCollapse(row.id)} className="rowHeader">
                {row.title}
              </div>
              {!row.isCollapsed &&
                row.children.map((child, index) => (
                  <Draggable
                    key={child.id}
                    draggableId={child.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="row"
                      >
                        {child.content}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default VirtualProfileNew;
