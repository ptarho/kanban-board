import { type IssueType } from "../types";

export const issueDto = (issue: Record<string, unknown>) => {
  const {
    id,
    url,
    state,
    title,
    body,
    user,
    assignee,
    comments,
    html_url,
    created_at,
  } = issue;
  return {
    id,
    url,
    state,
    title,
    body,
    user,
    assignee,
    comments,
    htmlUrl: html_url,
    createdAt: created_at,
  } as IssueType;
};
