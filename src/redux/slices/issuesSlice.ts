import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ColumnType, IssueType } from "../../types";

export interface IssuesState {
  [repoName: string]: Record<ColumnType, IssueType[]>;
}

const initialState: IssuesState = {};

export const issuesSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setIssues: (
      state,
      action: PayloadAction<{
        repoName: string;
        issues: Record<ColumnType, IssueType[]>;
      }>
    ) => {
      const { repoName, issues } = action.payload;
      return { ...state, [repoName]: issues };
    },
  },
});

export const { setIssues } = issuesSlice.actions;

export default issuesSlice.reducer;
