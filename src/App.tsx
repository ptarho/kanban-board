import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { type Issue } from "./issue";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/Column";

function App() {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [todo, setTodo] = useState<Issue[]>([]);
  const [inProgress, setInProgress] = useState<Issue[]>([]);
  const [done, setDone] = useState<Issue[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    const url = form.repositoryUrl.value;
    console.log(url);

    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);

    if (match) {
      const owner = match[1];
      const repoName = match[2];
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/issues?per_page=50&page=1&state=all`;

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = (await response.json()) as Issue[];
          console.log(data.length);
          setTodo(
            data.filter((issue) => issue.state === "open" && !issue.assignee)
          );
          console.log(data.length);
          setInProgress(
            data.filter((issue) => issue.state === "open" && issue.assignee)
          );
          setDone(data.filter((issue) => issue.state !== "open"));
          console.log(data);
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
      <header className="bg-light rounded-3 w-50 m-auto mt-5 p-4 container center ">
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
        {/* <DragDropContext>

        </DragDropContext> */}
        <DragDropContext onDragEnd={() => {}}>
          <div
            className="d-inline-flex justify-content-around align-items-start w-100 mt-5"
            
          >
            <Column title="TODO" issues={todo} id="todo" />
            <Column title="IN PROGRESS" issues={inProgress} id="inProgress" />
            <Column title="DONE" issues={done} id="done" />
          </div>
        </DragDropContext>
      </main>
    </>
  );
}

export default App;
