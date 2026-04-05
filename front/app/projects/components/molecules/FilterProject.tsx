"use client"

import { TaskStatus } from "@/src/projects/types/projects.types";

// Mapeo de los valores del enum de la DB a labels legibles para el usuario
const STATUSES: { label: string; value: TaskStatus }[] = [
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
];

export interface FilterProjectProps {
  // Array de los status actualmente activos como filtro (puede tener varios a la vez)
  taskStatus: TaskStatus[];
  // Setter del useState que vive en el page — se pasa hacia abajo para modificarlo desde aquí
  setTaskStatus: React.Dispatch<React.SetStateAction<TaskStatus[]>>;
}

export default function FilterProject({
  taskStatus,
  setTaskStatus,
}: FilterProjectProps) {
  // Si el status ya está en el array lo quita (deselecciona), si no está lo agrega
  const toggle = (status: TaskStatus) => {
    setTaskStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const isActive = (status: TaskStatus) => taskStatus.includes(status);

  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <p className="font-bold">filter by state</p>

      {/* Botón "All": resetea el array a vacío, lo que significa sin filtro activo */}
      <button
        onClick={() => setTaskStatus([])}
        className={`cursor-pointer w-full transition duration-500 rounded ${
          // Se marca activo cuando no hay ningún filtro seleccionado
          taskStatus.length === 0
            ? "bg-overlay text-fg"
            : "bg-surface text-fg-muted hover:bg-overlay hover:text-fg"
        }`}
      >
        All
      </button>

      {/* Un botón por cada status, generado desde el array STATUSES */}
      {STATUSES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => toggle(value)}
          className={`cursor-pointer w-full transition duration-500 rounded ${
            // Resaltado visual cuando este status está dentro del array activo
            isActive(value)
              ? "bg-overlay text-fg"
              : "bg-surface text-fg-muted hover:bg-overlay hover:text-fg"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
