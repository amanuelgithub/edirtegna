// custom hooks for authentication
export {
  seedRoles,
  loginMutationOptions,
  login,
  useLoginMutation,
  useRegisterMutation,
  useSetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} from './mutations';

// export zod schemas & types
export {
  loginSchema,
  registerSchema,
  setPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  logoutSchema,
  changePasswordSchema,
  LoginDTO,
  RegisterDTO,
  SetPasswordDTO,
  VerifyOtpDTO,
  ResendOtpDTO,
  ForgotPasswordDTO,
  LogoutDTO,
  ChangePasswordDTO,
} from './types';
