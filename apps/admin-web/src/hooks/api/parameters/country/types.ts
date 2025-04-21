import { z } from 'zod';

//
export const countrySchema = z.object({
  id: z.number().optional(),
  countryName: z.string().nonempty('Country name is required'),
  shortName: z.string().nonempty('Short name is required'),
  phonePrefix: z.string().nonempty('Phone prefix is required'),
  isActive: z.boolean(),
  icon: z
    .array(
      z.object({
        originFileObj: z
          .instanceof(File)
          .refine(
            (file) =>
              file.size / 1024 / 1024 < 2 &&
              (file.type === 'image/jpeg' || file.type === 'image/png'),
            {
              message: 'File must be a JPG/PNG and smaller than 2MB',
            },
          ),
      }),
    )
    .min(1, 'Please upload an image')
    .optional(),
});
export type CountryType = z.infer<typeof countrySchema>;

// Create Form Schema
export const countryCreateFormSchema = countrySchema.extend({});
export type CountryCreateFormType = z.infer<typeof countryCreateFormSchema>;

// Update Form Schema
// export const countryUpdateFormSchema = countrySchema.partial().extend({
export const countryUpdateFormSchema = countrySchema.extend({
  id: z.number(),
  icon: z
    .array(
      z.object({
        originFileObj: z
          .instanceof(File)
          .refine(
            (file) =>
              file.size / 1024 / 1024 < 2 &&
              (file.type === 'image/jpeg' || file.type === 'image/png'),
            {
              message: 'File must be a JPG/PNG and smaller than 2MB',
            },
          ),
      }),
    )
    .optional(),
});
export type CountryUpdateFormType = z.infer<typeof countryUpdateFormSchema>;
