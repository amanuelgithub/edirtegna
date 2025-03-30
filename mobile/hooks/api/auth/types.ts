import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(9, 'Phone number must be at least 9 digits')
    .max(9, 'Phone number must be at most 9 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  identifier: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const setPasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
      });
    }
  });
export type SetPasswordDTO = z.infer<typeof setPasswordSchema>;

export const verifyOtpSchema = z.object({
  identifier: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  identifier: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
export type ResendOtpDTO = z.infer<typeof resendOtpSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

export const logoutSchema = z.object({
  identifier: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
export type LogoutDTO = z.infer<typeof logoutSchema>;

export const changePasswordSchema = z
  .object({
    identifier: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\d+$/, 'Phone number must contain only digits'),
    oldPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password must be different from the old password',
      });
    }
  });
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
