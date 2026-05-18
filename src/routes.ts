import { Router } from "express";
import { login, register, info } from "./controllers/usersController.auth";
import { isAuthenticated } from "./middlewares/UserAuth";
import { createSymptom, deleteSymptom, getSymptomById, listSymptom, updateSymptom } from "./controllers/symptomsController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", isAuthenticated, info);

router.post("/symptoms", isAuthenticated, createSymptom);
router.get("/symptoms", isAuthenticated, listSymptom);
router.get("/symptoms/:id", isAuthenticated, getSymptomById);
router.put("/symptoms/:id", isAuthenticated, updateSymptom);
router.delete("/symptoms/:id", isAuthenticated, deleteSymptom);


export default router;
