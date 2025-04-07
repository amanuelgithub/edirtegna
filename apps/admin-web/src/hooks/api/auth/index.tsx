export {
  // query keys
  authQueryKeys,
  // query options
  createGetProfileQueryOptions,
} from './query-options';
export { createLogoutMutationOptions } from './mutation-options';
export {
  loginMutationOptions,
  login,
  useLoginMutation,
  useRegisterMutation,
  useSetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  // useLogoutMutation,
  useChangePasswordMutation,
} from './mutations';
export {} from './queries';

// all the api
export * from './api';

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
} from './types';
export type {
  LoginDTO,
  RegisterDTO,
  SetPasswordDTO,
  VerifyOtpDTO,
  ResendOtpDTO,
  ForgotPasswordDTO,
  LogoutDTO,
  ChangePasswordDTO,
} from './types';
