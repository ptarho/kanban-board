import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Board from "./components/Board";
import { type IssueType } from "./types/";
import { setIssues } from "./redux/slices/issuesSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { issueDto } from "./helpers";
import cl from "./App.module.css";

function App() {
  const dispatch = useAppDispatch();
  const reduxIssues = useAppSelector((state) => state.issues);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [repoName, setRepoName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    const repositoryUrlInput = form.elements.namedItem(
      "repositoryUrl"
    ) as HTMLInputElement; // in order to let test find this input
    const url = repositoryUrlInput.value;
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);

    if (match) {
      const owner = match[1];
      const repoName = match[2];
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/issues?per_page=50&page=1&state=all`;

      // Check if issues is already in redux
      if (reduxIssues[`${owner}/${repoName}`]) {
        setRepoName(`${owner}/${repoName}`);
        form.repositoryUrl.value = "";
        setValidated(false);
        return reduxIssues[`${owner}/${repoName}`];
      }

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = ((await response.json()) as IssueType[]).map((issue) => {
            return issueDto(issue);
          });

          const todoColumn = data.filter(
            (issue) => issue.state === "open" && !issue.assignee
          );
          const inProgressColumn = data
            .filter((issue) => issue.state === "open" && issue.assignee)
            .map((issue) => {
              return {
                ...issue,
                state: "in progress" as "open" | "closed" | "in progress",
              };
            });
          const doneColumn = data.filter((issue) => issue.state !== "open");

          setRepoName(`${owner}/${repoName}`);
          dispatch(
            setIssues({
              repoName: `${owner}/${repoName}`,
              issues: {
                todo: todoColumn,
                inProgress: inProgressColumn,
                done: doneColumn,
              },
            })
          );
          form.repositoryUrl.value = "";
          setValidated(false);
        } else {
          setError(`Failed to fetch issues: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching issues: ${error}`);
      }
    } else {
      setError("Invalid repository URL");
    }
  };

  return (
    <>
      <header className="bg-light rounded-3 w-50 m-auto mt-4 p-4 container center ">
        <h1 className="header">Welcome To Github Issues Board</h1>
        <p>Enter a repository url to start</p>
        <Form onSubmit={handleSubmit} noValidate validated={validated}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Repository URL"
              name="repositoryUrl"
              required
              onChange={() => {
                error && setError("");
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide repository URL.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-3 d-flex justify-content-center"
          >
            Get issues
          </Button>
        </Form>
        {error && <p className="mt-2 mb-0 text-danger text-center">{error}</p>}
      </header>

      <main>
        {repoName && (
          <div className="d-flex justify-content-center mt-4 mb-0 display-5">
            <a
              href={`https://github.com/${repoName.split("/")[0]}`}
              className={cl.repoName}
              target="_blank"
            >
              {repoName.split("/")[0].toUpperCase()}
            </a>
            <span> {" > "} </span>
            <a
              href={`https://github.com/${repoName}`}
              className={cl.repoName}
              target="_blank"
            >
              {repoName.split("/")[1].toUpperCase()}
            </a>
          </div>
        )}

        <Board repoName={repoName} />
      </main>
    </>
  );
}

export default App;
