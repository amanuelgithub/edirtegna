import { z } from 'zod';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
type ILogin = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(20)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/),
});
type IRegister = z.infer<typeof registerSchema>;

const refreshSchema = z.object({
  accessToken: z.string(),
});
type IRefresh = z.infer<typeof refreshSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email(), // not sure - maybe I'll use phone number instead
});
type IForgotPassword = z.infer<typeof forgotPasswordSchema>;

const logoutSchema = z.object({
  accessToken: z.string(),
});
type ILogout = z.infer<typeof logoutSchema>;

export {
  loginSchema,
  registerSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  ILogin,
  IRegister,
  IRefresh,
  ILogout,
  IForgotPassword,
};
