import * as yup from "yup";
export const authSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    password: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export const updateUserSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
