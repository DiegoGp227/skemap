import prisma from "../../db/prisma.js";
import { NotFoundError } from "../../errors/appError.js";
import { CreateTaskInput, UpdateTaskInput } from "./tasks.types.js";

/**
 * Crea una nueva tarea dentro de un epic.
 * Verifica que el usuario sea owner del proyecto antes de crear.
 * El orden se calcula automáticamente (máximo orden existente + 1).
 */
export const createTask = async (
  epicId: number,
  userId: number,
  data: CreateTaskInput,
) => {
  const epic = await prisma.epic.findUnique({
    where: { id: epicId },
    include: { project: { select: { ownerId: true } } },
  });

  if (!epic || epic.project.ownerId !== userId) {
    throw new NotFoundError("Epic");
  }

  const lastTask = await prisma.task.findFirst({
    where: { epicId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const order = (lastTask?.order ?? 0) + 1;
  const { acceptanceCriteria, dueDate, ...taskData } = data;

  return prisma.task.create({
    data: {
      ...taskData,
      epicId,
      order,
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      ...(acceptanceCriteria?.length
        ? {
            acceptanceCriteria: {
              create: acceptanceCriteria.map((text: string, index: number) => ({
                text,
                order: index + 1,
              })),
            },
          }
        : {}),
    },
    include: {
      acceptanceCriteria: { orderBy: { order: "asc" } },
    },
  });
};

/**
 * Elimina una tarea.
 * Verifica que el usuario sea owner del proyecto antes de eliminar.
 */
export const deleteTask = async (taskId: number, userId: number) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { epic: { select: { project: { select: { ownerId: true } } } } },
  });

  if (!task || task.epic.project.ownerId !== userId) {
    throw new NotFoundError("Task");
  }

  await prisma.task.delete({ where: { id: taskId } });
};

/**
 * Actualiza los campos de una tarea.
 * Verifica que el usuario sea owner del proyecto antes de actualizar.
 */
export const updateTask = async (
  taskId: number,
  userId: number,
  data: UpdateTaskInput,
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { epic: { select: { project: { select: { ownerId: true } } } } },
  });

  if (!task || task.epic.project.ownerId !== userId) {
    throw new NotFoundError("Task");
  }

  const { acceptanceCriteria, ...rest } = data;

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...rest,
      ...(acceptanceCriteria !== undefined
        ? {
            acceptanceCriteria: {
              deleteMany: {},
              create: acceptanceCriteria.map((text, index) => ({
                text,
                order: index + 1,
              })),
            },
          }
        : {}),
    },
    include: {
      acceptanceCriteria: { orderBy: { order: "asc" } },
    },
  });
};
