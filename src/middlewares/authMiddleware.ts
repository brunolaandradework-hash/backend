import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  sub: string;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Payload;

    req.user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).end();
  }
};
