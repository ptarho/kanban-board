export type IssueType = {
  id: number;
  url: string;
  htmlUrl: string;
  state: "open" | "closed" | "in progress";
  title: string;
  body: string;
  comments: number;
  createdAt: string;
  user?: {
    login: string;
    avatar_url: string;
    url: string;
  };
  assignee?: { title: string; name: string; avatar_url: string; url: string };
};
