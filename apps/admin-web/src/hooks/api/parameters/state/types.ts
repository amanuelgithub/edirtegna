import { z } from 'zod';

export const stateSchema = z.object({
  id: z.number().optional(),
  stateName: z.string().nonempty('State name is required'),
});
export type StateType = z.infer<typeof stateSchema>;

// Create Form Schema
export const stateCreateFormSchema = stateSchema.extend({
  countryId: z.number().nonnegative('Country ID is required'),
});
export type StateCreateFormType = z.infer<typeof stateCreateFormSchema>;

// Update Form Schema
export const stateUpdateFormSchema = stateSchema.partial().extend({
  id: z.number(),
});
export type StateUpdateFormType = z.infer<typeof stateUpdateFormSchema>;
