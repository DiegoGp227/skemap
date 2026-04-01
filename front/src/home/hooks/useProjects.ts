import { useCallback, useState } from "react";
import { getProjects } from "../services/projects.services";
import { Project } from "../types/home.types";

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (status: string, search: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProjects(status, search);
      setProjects(data.projects);
    } catch (err) {
      setError("Error loading projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, error, fetchProjects };
}
