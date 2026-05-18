import { Response, Request } from "express";
import { createUserSchema, loginUserSchema } from "../types/auth.schema";
import { registerUser, loginUser, getInfoUser } from "../services/usersAuthService";
import { ZodError } from "zod";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = createUserSchema.parse(req.body);

    const authUser = await registerUser({ name, email, password });

    return res.status(201).json(authUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.flatten().fieldErrors,
      });
    }

    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginUserSchema.parse(req.body);

    const authUser = await loginUser({ email, password });

    return res.json(authUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.flatten().fieldErrors,
      });
    }

    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

const info = async (req: Request, res: Response) => {
  const user_id = req.user_id;

  const user = await getInfoUser(user_id);

  return res.json(user);
};

export { register, login, info };