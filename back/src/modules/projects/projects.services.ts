import prisma from "../../db/prisma.js";
import { ConflictError, NotFoundError } from "../../errors/appError.js";
import { CreateProjectInput, UpdateProjectInput } from "./projects.types.js";

/**
 * @param userId - ID del usuario extraído del token JWT (llega como string)
 * @returns Array de proyectos con sus campos básicos
 */

export const getProjectsByUser = async (userId: number) => {
  // prisma.project.findMany busca múltiples registros que cumplan el filtro.
  // `where` es el equivalente al WHERE de SQL.
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId, // equivale a WHERE "ownerId" = $1
    },

    // `select` define exactamente qué campos traer de la BD.
    // Buena práctica: nunca traer más datos de los necesarios.
    // Si omites `select`, Prisma trae todos los campos del modelo.
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },

    // `orderBy` ordena los resultados. Aquí los más recientes primero.
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};

/**
 * @param projectId - ID del proyecto que se quiere obtener (viene de req.params)
 * @param userId    - ID del usuario autenticado (viene del token JWT)
 * @returns El proyecto encontrado o null si no existe
 */

export const getProjectById = async (projectId: number, userId: number) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!project || project.ownerId !== userId) {
    return null;
  }

  return project;
};

/**
 * @param data    - Campos del proyecto a crear
 * @param ownerId - ID del usuario autenticado
 * @returns El proyecto creado
 */
export const createProject = async (
  data: CreateProjectInput,
  ownerId: number,
) => {
  const existing = await prisma.project.findUnique({
    where: { ownerId_name: { ownerId, name: data.name } },
  });

  if (existing) {
    throw new ConflictError(`A project named "${data.name}" already exists`);
  }

  const project = await prisma.project.create({
    data: { ...data, ownerId },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
};

/**
 * @param projectId - ID del proyecto a actualizar
 * @param userId    - ID del usuario autenticado
 * @param data      - Campos a actualizar (parciales)
 * @returns El proyecto actualizado
 */

export const updateProject = async (
  projectId: number,
  userId: number,
  data: UpdateProjectInput,
) => {
  const existing = await getProjectById(projectId, userId);

  if (!existing) {
    throw new NotFoundError("Project");
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
};

/**
 * @param projectId - ID del proyecto a eliminar
 * @param userId    - ID del usuario autenticado
 */
export const deleteProject = async (projectId: number, userId: number) => {
  const existing = await getProjectById(projectId, userId);

  if (!existing) {
    throw new NotFoundError("Project");
  }

  await prisma.project.delete({ where: { id: projectId } });
};
