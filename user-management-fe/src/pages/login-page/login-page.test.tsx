import { screen, render } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
import LoginPage from "./login-page";

it("render the login page", () => {
  render(<LoginPage />);
  const heading = screen.getByRole("heading", { name: "Login" });
  expect(heading).toBeInTheDocument();
});

it("render form elements for login", () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});

it("should validate the inputs as required", async () => {
  render(<LoginPage />);
  
  //submit form

  await userEvent.click(screen.getByRole("button", { name: /submit/i }))

  //expect validation errors
  expect(await screen.findByText(/The email field is required/i)).toBeVisible();
  expect(await screen.findByText(/The password field is required/i)).toBeVisible();
})