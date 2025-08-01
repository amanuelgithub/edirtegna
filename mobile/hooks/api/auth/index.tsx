export {
  // query keys
  authQueryKeys,
  // query options
  createGetProfileQueryOptions,
} from './query-options';
export { createLogoutMutationOptions } from './mutation-options';
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
  // useLogoutMutation,
  useChangePasswordMutation,
} from './mutations';
export { useGetProfile } from './queries';

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
  LoginDTO,
  RegisterDTO,
  SetPasswordDTO,
  VerifyOtpDTO,
  ResendOtpDTO,
  ForgotPasswordDTO,
  LogoutDTO,
  ChangePasswordDTO,
} from './types';
