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
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[a-zA-Z]+$/, 'First name must contain only letters')
    .optional(),
  middleName: z
    .string()
    .min(3, 'Middle name must be at least 3 characters')
    .max(50, 'Middle name must be at most 50 characters')
    .regex(/^[a-zA-Z]+$/, 'Middle name must contain only letters')
    .optional(),
  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters')
    .optional(),
  phone: z
    .string()
    .min(9, 'Phone number must be at least 9 digits')
    .max(9, 'Phone number must be at most 9 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const setPasswordSchema = z
  .object({
    identifier: z
      .string()
      .min(9, 'Phone number must be at least 9 digits')
      .max(9, 'Phone number must be at most 9 digits'),
    previousPassword: z.string().min(4, 'Current password is required'),
    password: z.string().min(4, 'New password must be at least 4 characters'),
    confirmPassword: z
      .string()
      .min(4, 'Confirm password must be at least 4 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
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
    .min(9, 'Phone number must be at least 9 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  // otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  otp: z
    .string()
    .length(4, 'OTP must be exactly 4 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
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

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;

// Reuse refreshTokenSchema directly for logoutSchema
export const logoutSchema = refreshTokenSchema;

export type LogoutDTO = RefreshTokenDTO;
