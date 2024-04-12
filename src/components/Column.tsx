import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { type IssueType } from "../types/issue";
import IssueCard from "./IssueCard";

type Props = {
  title: "todo" | "in progress" | "done";
  issues: IssueType[];
  id: string;
};

const Column: React.FC<Props> = ({ title, issues, id }) => {
  return (
    <div
      className="card d-flex justify-content-start border-2"
      style={{ height: "500px", overflow: "hidden", width: "30%" }}
    >
      <h6 className="text-center pt-2 pb-2 mb-0 bg-primary">{title}</h6>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-3 d-flex flex-column gap-3"
            style={{
              maxHeight: "500px",
              overflowY: "scroll",
              flexGrow: 1,
              backgroundColor: snapshot.isDraggingOver ? "#F8F9FA" : "",
            }}
          >
            {issues.map((issue, idx) => (
              <IssueCard index={idx} issue={issue} column={title} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
