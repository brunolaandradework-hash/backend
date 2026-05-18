import { z } from "zod";

export const createSymptomSchema = z.object({
  painLevel: z
    .number()
    .int()
    .min(1, "O nível de dor deve ser entre 1 e 10")
    .max(10, "O nível de dor deve ser entre 1 e 10"),

  fatigueLevel: z
    .number()
    .int()
    .min(1, "O nível de fadiga deve ser entre 1 e 10")
    .max(10, "O nível de fadiga deve ser entre 1 e 10"),

  sleepQuality: z
    .number()
    .int()
    .min(1, "A qualidade do sono deve ser entre 1 e 10")
    .max(10, "A qualidade do sono deve ser entre 1 e 10"),

  mood: z
    .string()
    .min(2, "Humor inválido")
    .max(100, "Humor muito grande"),

  notes: z
    .string()
    .max(500, "Observações muito grandes")
    .optional(),
});

export const updateSymptomSchema = createSymptomSchema.partial();

export type CreateSymptomDTO = z.infer<typeof createSymptomSchema>;

export type UpdateSymptomDTO = z.infer<typeof updateSymptomSchema>;