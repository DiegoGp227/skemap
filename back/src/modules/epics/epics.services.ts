import prisma from "../../db/prisma.js";
import { NotFoundError } from "../../errors/appError.js";
import { CreateEpicInput, UpdateEpicInput } from "./epics.types.js";

/**
 * Crea un nuevo epic dentro de un proyecto.
 * Verifica que el usuario sea owner del proyecto antes de crear.
 * El orden se calcula automáticamente (máximo orden existente + 1).
 */
export const createEpic = async (
  projectId: number,
  userId: number,
  data: CreateEpicInput,
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    throw new NotFoundError("Project");
  }

  const lastEpic = await prisma.epic.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const order = (lastEpic?.order ?? 0) + 1;

  return prisma.epic.create({
    data: { ...data, projectId, order },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      order: true,
      projectId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteEpic = async (epicId: number, userId: number) => {
  const epic = await prisma.epic.findUnique({
    where: { id: epicId },
    include: { project: { select: { ownerId: true } } },
  });

  if (!epic || epic.project.ownerId !== userId) {
    throw new NotFoundError("Epic");
  }

  await prisma.epic.delete({ where: { id: epicId } });
};

export const updateEpic = async (
  epicId: number,
  userId: number,
  data: UpdateEpicInput,
) => {
  const epic = await prisma.epic.findUnique({
    where: { id: epicId },
    include: { project: { select: { ownerId: true } } },
  });

  if (!epic || epic.project.ownerId !== userId) {
    throw new NotFoundError("Epic");
  }

  return prisma.epic.update({
    where: { id: epicId },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      order: true,
      projectId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
