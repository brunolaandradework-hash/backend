import { prisma } from "../libs/prisma.config";

interface CreateCommentService {
  content: string;
  userId: number;
  postId: number;
}

export const createCommentService = async ({
  content,
  userId,
  postId,
}: CreateCommentService) => {
  const postExists = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!postExists) {
    throw new Error("Post não encontrado");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      post: {
        select: {
          id: true,
        },
      },
    },
  });

  return comment;
};

export const listCommentsService = async (
  postId: number
) => {

  const postExists = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!postExists) {
    throw new Error("Post não encontrado");
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return comments;
};

export const deleteCommentById = async (
  userId: number,
  commentId: number
) => {

  const commentExists = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId: userId,
    },
  });

  if (!commentExists) {
    throw new Error(
      "Comentário não encontrado ou não pertence ao usuário"
    );
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};