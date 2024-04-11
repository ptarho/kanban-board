import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { type Issue } from "../issue";

type Props = {
  issue: Issue;
  index: number;
};

const IssueCard: React.FC<Props> = ({ issue, index }) => {
  return (
    <Draggable draggableId={issue.id.toString()} key={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={snapshot.isDragging ? "draggin" : "card"}
        >
          <h6>{issue.title}</h6>
          <p>Assignee: {issue.assignee?.name}</p>
          <p>Status: {issue.state}</p>
        </div>
      )}
    </Draggable>
  );
};

export default IssueCard;
