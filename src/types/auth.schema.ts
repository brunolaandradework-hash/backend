import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome precisa ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha inválida"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;