import { z } from 'zod';

export const countrySchema = z.object({
  countryName: z.string().min(3, 'Country name must be at least 3 characters'),
  shortName: z.string().optional(),
  phonePrefix: z
    .string()
    .regex(
      /^\+\d+$/,
      'Phone prefix must start with "+" and contain only digits',
    )
    .optional(),
  icon: z.string().optional(),
});
export type CountryDTO = z.infer<typeof countrySchema>;
// export type CountryFormValues = z.infer<typeof countrySchema>;
