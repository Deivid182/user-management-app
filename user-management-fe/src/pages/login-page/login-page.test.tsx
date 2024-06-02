import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./login-page";

const queryClient = new QueryClient();

const getSubmitBtn = () => screen.getByRole("button", { name: /submit/i });

it("render the login page", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
  const heading = screen.getByRole("heading", { name: "Login" });
  expect(heading).toBeInTheDocument();
});

it("render form elements for login", () => {
  render(<LoginPage />);
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(getSubmitBtn()).toBeInTheDocument();
});

it("should validate the inputs as required", async () => {
  render(<LoginPage />);

  //submit form

  await userEvent.click(getSubmitBtn());

  //expect validation errors
  expect(await screen.findByText(/The email field is required/i)).toBeVisible();
  expect(
    await screen.findByText(/The password field is required/i)
  ).toBeVisible();
});

it("should validate email format", async () => {
  render(<LoginPage />);

  await userEvent.type(screen.getByLabelText("Email"), "invalid email");

  await userEvent.click(getSubmitBtn());
  expect(
    await screen.findByText(/The email format is not valid/i)
  ).toBeVisible();
});

it.only("should disable the submit form while the request is executing", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
  expect(getSubmitBtn()).not.toBeDisabled();

  await userEvent.type(screen.getByLabelText("Email"), "dave@gmail.com");
  await userEvent.type(screen.getByLabelText("Password"), "password");

  await userEvent.click(getSubmitBtn());

  await waitFor(() => expect(getSubmitBtn()).toBeDisabled());

  await waitFor(() =>expect(screen.getByText("Success!")).toBeInTheDocument(), { timeout: 3000 });

});
