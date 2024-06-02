
import * as yup from "yup"
export const loginSchema = yup
  .object({
    email: yup.string().required('The email field is required').email('The email format is not valid'),
    password: yup.string().required('The password field is required')
  })
  .required()