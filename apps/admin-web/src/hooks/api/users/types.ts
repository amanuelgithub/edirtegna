import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  userName: z.string().nonempty('User name is required'),
});
export type UserType = z.infer<typeof userSchema>;

// Create Form Schema
export const userCreateFormSchema = userSchema.extend({
  countryId: z.number().nonnegative('Country ID is required'),
  stateId: z
    .number()
    .nonnegative('State ID is required')
    .refine((value) => value !== undefined || value === null, {
      message: 'State ID must be a number if provided',
    }),
  // .optional(),
  // stateId: z
  //   .union([
  //     z.number().nonnegative('State ID is required'),
  //     z.null(),
  //     z.undefined(),
  //   ])
  //   .refine(
  //     (value) =>
  //       value !== undefined || value === null || typeof value === 'number',
  //     'State ID must be a number if provided',
  //   ),
});
export type UserCreateFormType = z.infer<typeof userCreateFormSchema>;

// Update Form Schema
export const userUpdateFormSchema = userSchema.partial().extend({
  id: z.number(),
});
export type UserUpdateFormType = z.infer<typeof userUpdateFormSchema>;
