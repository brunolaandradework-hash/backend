import { Router } from "express";
import { login, register, info } from "./controllers/usersController.auth";
import { isAuthenticated } from "./middlewares/authMiddleware";
import {
  createSymptom,
  deleteSymptom,
  SymptomById,
  listSymptom,
  updateSymptom,
} from "./controllers/symptomsController";
import {
  createPosts,
  PostById,
  listPosts,
  deletePost,
} from "./controllers/postsController";
import {
  createComment,
  deleteComment,
  listComments,
} from "./controllers/commentController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", isAuthenticated, info);

router.post("/symptoms", isAuthenticated, createSymptom);
router.get("/symptoms", isAuthenticated, listSymptom);
router.get("/symptoms/:id", isAuthenticated, SymptomById);
router.put("/symptoms/:id", isAuthenticated, updateSymptom);
router.delete("/symptoms/:id", isAuthenticated, deleteSymptom);

router.post("/posts", isAuthenticated, createPosts);
router.get("/posts", isAuthenticated, listPosts);
router.get("/posts/:id", isAuthenticated, PostById);
router.delete("/posts/:id", isAuthenticated, deletePost);

router.post("/posts/:postId/comments", isAuthenticated, createComment);
router.get("/posts/:postId/comments", isAuthenticated, listComments);
router.delete("/comments/:id", isAuthenticated, deleteComment);

export default router;
