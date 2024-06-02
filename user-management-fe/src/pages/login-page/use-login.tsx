import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Inputs } from "./login-page";
import { loginService } from "./login-service";
import { FetchError } from "../../utils";
export const useLogin = () => {


  const { mutate, isPending, isError, isSuccess, status, error, data } = useMutation({
    mutationFn: ({ email, password }: Inputs) => {
      return loginService(email, password);
    },
  });
  
  return { mutate, isPending, isError, isSuccess, status, error: error as FetchError, data };
}