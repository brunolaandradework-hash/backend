import { Router } from "express";
import { login, register, info } from "./controllers/users.auth";
import { isAuthenticated } from "./middlewares/UserAuth";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", isAuthenticated, info);

export default router;
