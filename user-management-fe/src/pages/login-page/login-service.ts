import axios from "axios";

export const loginService = async (email: string, password: string) => {
  await axios.post("/login", {
    email, password
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  })
};
