import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface VirtualProfileNewProps {}

interface ChildData {
  id: string;
  content: string;
}

interface TableRowData {
  id: string;
  title: string;
  children: ChildData[];
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
    const newRow: TableRowData = {
      id: `row-${rows.length + 1}`, // Ensure unique ID
      title: `Title ${rows.length + 1}`,
      children: [],
      isCollapsed: true,
    };
    setRows([...rows, newRow]);
  };

  // Handler to add a new record to the last title row
  const addRecordToLastTitle = () => {
    if (rows.length === 0) {
      console.warn("No title rows available to add a record");
      return;
    }
    const newRecord = {
      id: `child-${rows.length}-${rows[rows.length - 1].children.length + 1}`,
      content: `Content ${rows.length}-${
        rows[rows.length - 1].children.length + 1
      }`,
    };
    const newRows = [...rows];
    newRows[newRows.length - 1].children.push(newRecord);
    setRows(newRows);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                    >
                      <span
                        className={`arrowIcon ${
                          row.isCollapsed ? "collapsed" : "expanded"
                        }`}
                      >
                        ➤
                      </span>
                      {row.title}
                      <div {...provided.dragHandleProps} className="dragHandle">
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
                                >
                                  {child.content}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="dragHandle"
                                  >
                                    &#9776; {/* Hamburger icon */}
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
  );
};

export default VirtualProfileNew;
