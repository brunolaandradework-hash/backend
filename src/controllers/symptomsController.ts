import { Response, Request } from "express";
import { ZodError } from "zod";
import {
  createSymptomSchema,
  updateSymptomSchema,
} from "../types/symptom.schema";
import {
  createSymp,
  deleteSympById,
  getSymp,
  getSympById,
  updateSymp,
} from "../services/symptomService";

export const createSymptom = async (req: Request, res: Response) => {
  try {
    const { mood, fatigueLevel, painLevel, sleepQuality, notes } =
      createSymptomSchema.parse(req.body);

    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const symptom = await createSymp({
      mood,
      fatigueLevel,
      painLevel,
      sleepQuality,
      notes,
      userId,
    });

    return res.status(201).json(symptom);
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

export const listSymptom = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const symptom = await getSymp(userId);

    return res.status(201).json(symptom);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const SymptomById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);
    const symptomId = Number(req.params.id);

    if (!symptomId) {
      return res.status(400).json({ error: "ID do sintoma inválido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const symptom = await getSympById(userId, symptomId);

    return res.status(201).json(symptom);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const updateSymptom = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);
    const symptomId = Number(req.params.id);

    if (!symptomId) {
      return res.status(400).json({ error: "ID do sintoma inválido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
     const data = updateSymptomSchema.parse(req.body);

    const symptom = await updateSymp({
      userId,
      symptomId,
      ...data,
    });

    return res.status(201).json(symptom);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const deleteSymptom = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);
    const symptomId = Number(req.params.id);

    if (!symptomId) {
      return res.status(400).json({ error: "ID do sintoma inválido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const symptom = await deleteSympById(userId, symptomId);

    return res.status(201).json(symptom);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};