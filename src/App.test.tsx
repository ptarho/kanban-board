import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import App from "./App";

describe("Test if app is rendered", () => {
  it("render the App", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});

describe("Test the validation message of input field", () => {
  it("render the validation message", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button"));
    const inputValidationText = screen.getByText(
      /Please provide repository URL/i
    );
    expect(inputValidationText).toBeInTheDocument();
  });
});

describe("Handle wrong url input", () => {
  it("render the error message", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const inputField = screen.getByPlaceholderText(
      /Repository URL/i
    ) as HTMLInputElement;

    fireEvent.change(inputField, {
      target: { value: "Invalid repository url" },
    });

    expect(inputField.value).toBe("Invalid repository url");
    expect(inputField).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.getByText(/Please provide repository URL/i)
    ).toBeInTheDocument();
  });
});
