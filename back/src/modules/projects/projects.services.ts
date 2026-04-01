import prisma from "../../db/prisma.js";

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
