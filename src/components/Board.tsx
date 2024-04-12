import React from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ColumnType } from "../types";
import { setIssues } from "../redux/slices/issuesSlice";
import { reorder } from "../helpers";

type Props = {
  repoName: string;
};

const Board: React.FC<Props> = ({ repoName }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => {
    if (!repoName) {
      return {
        todo: [],
        inProgress: [],
        done: [],
      };
    }
    return state.issues[repoName];
  });

  const onDragEnd = (result: DropResult) => {
    const source = result.source;
    const destination = result.destination;
    if (!destination) {
      return;
    } else if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumnName = source.droppableId as ColumnType;
    const shallowSourceArray = [...columns[sourceColumnName]];

    // if we move issue in a same column
    if (source.droppableId === destination.droppableId) {
      const reorderedArray = reorder(
        shallowSourceArray,
        source.index,
        destination.index
      );
      dispatch(
        setIssues({
          repoName,
          issues: { ...columns, [sourceColumnName]: reorderedArray },
        })
      );
      return;
    } else {
      const [objectToRelocate] = shallowSourceArray.splice(source.index, 1);
      const destinationColumnName = destination.droppableId as ColumnType;
      const shallowDestinationArray = [...columns[destinationColumnName]];

      // change issue status
      const modifiedIssue = { ...objectToRelocate };
      switch (destinationColumnName) {
        case "todo":
          modifiedIssue.state = "open";
          break;
        case "inProgress":
          modifiedIssue.state = "in progress";
          break;
        case "done":
          modifiedIssue.state = "closed";
          break;
      }
      shallowDestinationArray.splice(destination.index, 0, modifiedIssue);

      dispatch(
        setIssues({
          repoName,
          issues: {
            ...columns,
            [sourceColumnName]: shallowSourceArray,
            [destinationColumnName]: shallowDestinationArray,
          },
        })
      );
      return;
    }
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        onDragEnd(result);
      }}
    >
      <div className="d-inline-flex justify-content-around align-items-start w-100 mt-4">
        <Column title="todo" issues={columns.todo} id="todo" />
        <Column
          title="in progress"
          issues={columns.inProgress}
          id="inProgress"
        />
        <Column title="done" issues={columns.done} id="done" />
      </div>
    </DragDropContext>
  );
};

export default Board;
