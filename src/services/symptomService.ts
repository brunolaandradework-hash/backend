import { prisma } from "../libs/prisma.config";
import { CreateSymptomDTO, UpdateSymptomDTO } from "../types/symptom.schema";

interface createSymptomService extends CreateSymptomDTO {
  userId: number;
}

interface UpdateSymptomService extends UpdateSymptomDTO {
  symptomId: number;
  userId: number;
}

export const createSymp = async ({
  fatigueLevel,
  mood,
  painLevel,
  sleepQuality,
  notes,
  userId,
}: createSymptomService) => {

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const symptomAlreadyExists = await prisma.symptom.findFirst({
   where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (symptomAlreadyExists) {
    throw new Error("Você já realizou um registro hoje");
  }

  const symptom = await prisma.symptom.create({
    data: {
      painLevel,
      fatigueLevel,
      sleepQuality,
      mood,
      notes,
      userId,
    },
  });

  return symptom;
}; 

export const getSymp = async (userId: number) => {
  const symptoms = await prisma.symptom.findMany({
    where: {
      userId: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      painLevel: true,
      fatigueLevel: true,
      sleepQuality: true,
      mood: true,
      notes: true,
      createdAt: true,
    },
  });

  return symptoms;
};

export const getSympById = async (userId: number, symptomId: number) => {
  const symptomsExists = await prisma.symptom.findFirst({
    where: {
      userId: userId,
      id: symptomId,
    },
  });

  if (!symptomsExists) {
    throw new Error("Registro de sintoma não encontrado");
  }

  const symptoms = await prisma.symptom.findFirst({
    where: {
      id: symptomId,
    },
    select: {
      id: true,
      painLevel: true,
      fatigueLevel: true,
      sleepQuality: true,
      mood: true,
      notes: true,
      createdAt: true,
    },
  });

  return symptoms;
};

export const updateSymp = async ({
  userId,
  symptomId,
  fatigueLevel,
  mood,
  notes,
  painLevel,
  sleepQuality,
}: UpdateSymptomService) => {
  const symptomsExists = await prisma.symptom.findFirst({
    where: {
      userId: userId,
      id: symptomId,
    },
  });

  if (!symptomsExists) {
    throw new Error("Registro de sintoma não encontrado");
  }

  const symptom = await prisma.symptom.update({
    where: {
      id: symptomId,
    },
    data: {
      painLevel,
      fatigueLevel,
      sleepQuality,
      mood,
      notes,
    },
  });

  return symptom;
};

export const deleteSympById = async (userId: number, symptomId: number) => {
  const symptomsExists = await prisma.symptom.findFirst({
    where: {
      userId: userId,
      id: symptomId,
    },
  });

  if (!symptomsExists) {
    throw new Error("Registro de sintoma não encontrado");
  }

  await prisma.symptom.delete({
    where: {
      id: symptomId,
    },
  });

  return {
    messege: "Registro removido com sucesso!",
  };
};
