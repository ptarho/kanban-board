export type Issue = {
  id: number;
  url: string;
  state: "open" | "close";
  title: string;
  body: string;
  user?: {
    title: string;
    name: string;
    avatar_url: string;
    url: string;
  };
  assignee?: { title: string; name: string; avatar_url: string; url: string };
};
