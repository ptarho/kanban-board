import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { type IssueType } from "../types/issue";
import { cl, daysAgoFromDate } from "../helpers";
import Image from "react-bootstrap/Image";

type Props = {
  issue: IssueType;
  column: "todo" | "in progress" | "done";
  index: number;
};

const IssueCard: React.FC<Props> = ({ issue, index, column }) => {
  return (
    <Draggable draggableId={issue.id.toString()} key={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cl(snapshot.isDragging && "draggin", "card p-1")}
        >
          <h6>{issue.title}</h6>

          {issue.user && (
            <div className="d-flex align-items-center mt-1 mb-1">
              <Image
                src={issue.user.avatar_url}
                rounded
                width={50}
                height={50}
              />
              <p className="m-1">
                <a href={issue.user.url}>{issue.user.login}</a>
                <span className="m-0 d-block">Comments: {issue.comments}</span>
              </p>
              <div className="ms-auto me-1">
                <p className="mb-0">Status:</p>
                <p
                  className={cl(
                    column === "todo" && "bg-success",
                    column === "in progress" && "bg-warning",
                    column === "done" && "bg-danger",
                    "text-white rounded-3 p-1 pt-0 mb-0"
                  )}
                >
                  {issue.state}
                </p>
              </div>
            </div>
          )}

          <p className="m-1 d-flex">
            <span className="mb-0">
              Created: {daysAgoFromDate(issue.createdAt)}
            </span>

            <span className="ms-auto d-inline-block">
              <a href={issue.htmlUrl} target="_blank">
                #{issue.id}
              </a>
            </span>
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default IssueCard;
