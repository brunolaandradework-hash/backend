import { prisma } from "../libs/prisma.config";
import { CreatePostDTO } from "../types/post.schema";

interface createPostService extends CreatePostDTO {
  content: string;
  userId: number;
}

export const createPost = async ({ content, userId }: createPostService) => {
  const post = await prisma.post.create({
    data: {
      content,
      userId,
    },
  });

  return post;
};

export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
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

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};

export const getPostsById = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
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

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return post;
};

export const deletePostById = async (userId: number, postId: number) => {
  const postExists = await prisma.post.findFirst({
    where: {
      id: postId,
      userId: userId,
    },
  });

  if (!postExists) {
    throw new Error("Post não encontrado ou não pertence ao usuário");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
