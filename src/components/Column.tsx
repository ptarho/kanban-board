import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { type Issue } from "../issue";
import IssueCard from "./IssueCard";

type Props = {
  title: string;
  issues: Issue[];
  id: string;
};

const Column: React.FC<Props> = ({ title, issues, id }) => {
  return (
    <div
      className="card d-flex justify-content-start border-2"
      style={{ height: "500px", overflow: "hidden", width: "30%" }}
    >
      <h6 className="text-center pt-2 pb-2 bg-primary">
        {title}
      </h6>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-3 d-flex flex-column gap-3"
            style={{ maxHeight: "500px", overflowY: "scroll", flexGrow: 1 }}
          >
            {issues.map((issue, idx) => (
              <IssueCard index={idx} issue={issue} />
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
