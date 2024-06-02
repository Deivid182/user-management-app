import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./login-page";
import { customRender } from "../../mocks/custom-render";
import { server } from "../../mocks/node";
import { http, HttpResponse } from "msw";
import type { Inputs } from "./login-page";

const getSubmitBtn = () => screen.getByRole("button", { name: /submit/i });

const mockServerError = async (statusCode: number) => {
  server.use(
    http.post('/login', () => {
      return HttpResponse.json(null, {
        status: statusCode
      })
    })
  )
};

const fillAndSubmitForm = async (payload: Inputs) => {
  await userEvent.type(screen.getByLabelText("Email"), payload.email);
  await userEvent.type(screen.getByLabelText("Password"), payload.password);
  await userEvent.click(getSubmitBtn());
}

it("render the login page", () => {
  customRender(<LoginPage />);
  const heading = screen.getByRole("heading", { name: "Login" });
  expect(heading).toBeInTheDocument();
});

it("render form elements for login", () => {
  customRender(<LoginPage />);
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(getSubmitBtn()).toBeInTheDocument();
});

it("should validate the inputs as required", async () => {
  customRender(<LoginPage />);
  //submit form

  await userEvent.click(getSubmitBtn());

  //expect validation errors
  expect(await screen.findByText(/The email field is required/i)).toBeVisible();
  expect(
    await screen.findByText(/The password field is required/i)
  ).toBeVisible();
});

it("should validate email format", async () => {
  customRender(<LoginPage />);

  await userEvent.type(screen.getByLabelText("Email"), "invalid email");

  await userEvent.click(getSubmitBtn());
  expect(
    await screen.findByText(/The email format is not valid/i)
  ).toBeVisible();
});

it("should disable the submit form while the request is executing", async () => {
  customRender(<LoginPage />);
  expect(getSubmitBtn()).not.toBeDisabled();

  await fillAndSubmitForm({
    email: "dave@gmail.com",
    password: "password",
  });

  await waitFor(() => expect(getSubmitBtn()).toBeDisabled());

  await waitFor(() =>expect(screen.getByText("Success!")).toBeInTheDocument(), { timeout: 3000 });
});

it("should show a loading indicator while the request is executing", async () => {
  customRender(<LoginPage />);

  expect(getSubmitBtn()).not.toBeDisabled();
  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

  await fillAndSubmitForm({
    email: "dave@gmail",
    password: "password",
  });

  await waitFor(() => expect(getSubmitBtn()).toBeDisabled());

  await waitFor(() => expect(screen.getByRole("progressbar")).toBeInTheDocument(), { timeout: 3000 });
})

it("should display an error alert when there is an error from the api", async () => {

  await mockServerError(500);

  customRender(<LoginPage />);

  await fillAndSubmitForm({
    email: "dave@gmail.com",
    password: "password",
  });

  await waitFor(() => expect(screen.getByText("Something went wrong")).toBeInTheDocument(), { timeout: 3000 });
})
it.only("should display an error alert when there is an error is because of invalid credentials", async () => {

  await mockServerError(401);

  customRender(<LoginPage />);

  await fillAndSubmitForm({
    email: "dave@gmail.com",
    password: "password",
  });

  await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeVisible(), { timeout: 1500 });
})
