import { Request, Response } from "express";
import { ZodError } from "zod";
import { createCommentSchema } from "../types/comment.schema";
import { createCommentService, listCommentsService, deleteCommentById } from "../services/commentService";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = createCommentSchema.parse(req.body);

    const userId = Number(req.user_id);
    const postId = Number(req.params.postId);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!postId) {
      return res.status(400).json({
        error: "ID do post inválido",
      });
    }

    const comment = await createCommentService({
      content,
      userId,
      postId,
    });

    return res.status(201).json(comment);
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

export const listComments = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.user_id);
    const postId = Number(req.params.postId);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!postId) {
      return res.status(400).json({
        error: "ID do post inválido",
      });
    }

    const comments = await listCommentsService(postId);

    return res.status(200).json(comments);

  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.user_id);
    const commentId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!commentId) {
      return res.status(400).json({
        error: "ID do comentário inválido",
      });
    }

    await deleteCommentById(userId, commentId);

    return res.status(200).json({
      message: "Comentário deletado com sucesso",
    });

  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};