import { z } from 'zod';

export const citySchema = z.object({
  id: z.number().optional(),
  cityName: z.string().nonempty('City name is required'),
});
export type CityType = z.infer<typeof citySchema>;

// Create Form Schema
export const cityCreateFormSchema = citySchema.extend({
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
export type CityCreateFormType = z.infer<typeof cityCreateFormSchema>;

// Update Form Schema
export const cityUpdateFormSchema = citySchema.partial().extend({
  id: z.number(),
});
export type CityUpdateFormType = z.infer<typeof cityUpdateFormSchema>;
