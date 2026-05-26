import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(3, "A publicação precisa ter no mínimo 3 caracteres")
    .max(1000, "A publicação pode ter no máximo 1000 caracteres"),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;