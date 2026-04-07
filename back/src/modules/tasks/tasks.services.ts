import prisma from "../../db/prisma.js";
import { NotFoundError } from "../../errors/appError.js";
import { CreateTaskInput } from "./tasks.types.js";

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
