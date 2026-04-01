import prisma from "../../db/prisma.js";

/**
 * @param userId - ID del usuario extraído del token JWT (llega como string)
 * @returns Array de proyectos con sus campos básicos
 */

export const getProjectsByUser = async (userId: string) => {
  // El id en el schema de Prisma es Int, pero el token lo guarda como string.
  // parseInt lo convierte antes de usarlo en la query.
  const ownerId = parseInt(userId);

  // prisma.project.findMany busca múltiples registros que cumplan el filtro.
  // `where` es el equivalente al WHERE de SQL.
  const projects = await prisma.project.findMany({
    where: {
      ownerId, // equivale a WHERE "ownerId" = $1
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
