import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup
    .string()
    .min(4, "Sorry, your username must be between 4 and 25 characters long")
    .max(25, "Sorry, your username must be between 4 and 25 characters long")
    .required("Enter username"),
  password: yup
    .string()
    .min(8, "Sorry, your username must be between 8 and 30 characters long")
    .max(30, "Sorry, your username must be between 8 and 30 characters long")
    .required("Enter username"),
});

export type LoginForm = yup.InferType<typeof loginSchema>;
