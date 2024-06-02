import { fetchItem } from "../../utils";

export const loginService = async (email: string, password: string) => {
  const { data } = await fetchItem("/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
  return data
};
