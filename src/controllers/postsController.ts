import { createPostSchema } from "../types/post.schema";
import { Response, Request } from "express";
import { ZodError } from "zod";
import {
  createPost,
  deletePostById,
  getPosts,
  getPostsById,
} from "../services/postService";

export const createPosts = async (req: Request, res: Response) => {
  try {
    const { content } = createPostSchema.parse(req.body);

    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const post = await createPost({ content, userId });

    return res.status(201).json(post);
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

export const listPosts = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const posts = await getPosts();

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const PostById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);
    const postId = Number(req.params.id);

    if (!postId) {
      return res.status(400).json({
        error: "ID do post inválido",
      });
    }

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const post = await getPostsById(postId);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);
    const postId = Number(req.params.id);

    if (!postId) {
      return res.status(400).json({
        error: "ID do post inválido",
      });
    }

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    await deletePostById(userId, postId);

    return res.status(200).json({
      message: "Post deletado com sucesso",
    });
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};
