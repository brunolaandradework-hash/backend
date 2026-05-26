import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(500, "O comentário pode ter no máximo 500 caracteres"),
});

export const updateCommentSchema = createCommentSchema.partial();

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;