import { prisma } from "../libs/prisma.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDTO, LoginUserDTO } from "../types/auth.schema";

export const registerUser = async ({
  name,
  email,
  password,
}: CreateUserDTO) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new Error("Usuária já existe");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async ({ email, password }: LoginUserDTO) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email ou senha incorretos");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Email ou senha incorretos");
  }

  const token = jwt.sign(
    {
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET as string,
    {
      subject: String(user.id),
      expiresIn: "30d",
    },
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

export const getInfoUser = async (id_user: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(id_user),
    },
    select: {
      id: true,
      name: true,
      email: true,
      posts: true,
    },
  });

  return user;
};
