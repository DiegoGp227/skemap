import { projectsURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";
import { ProjectsResponse } from "../types/home.types";

// El endpoint GET /projects acepta filtros opcionales como query params:
// /projects?status=active&search=mi+proyecto
// Los agregamos construyendo la URL antes de llamar al fetcher.
export function getProjects(
  status: string,
  search: string,
): Promise<ProjectsResponse> {
  const url = new URL(projectsURL.toString());

  // Solo agregamos el param si tiene valor real, para no enviar ?status=&search=
  if (status && status !== "all") url.searchParams.set("status", status);
  if (search) url.searchParams.set("search", search);

  // GET no tiene body, por eso usamos fetcher (no postFetcher).
  // fetcher<ProjectsResponse> le dice a TypeScript qué forma tiene la respuesta.
  return fetcher<ProjectsResponse>(url.toString());
}
