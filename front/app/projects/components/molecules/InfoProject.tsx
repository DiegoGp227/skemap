import ProgressBar from "@/app/components/molecules/ProgressBar";

interface InfoProjectProps {
  title: string;
  tecnologies: string[];
  color: string;
  current: number;
  total: number;
}

export default function InfoProject({
  title,
  tecnologies,
  color,
  current,
  total,
}: InfoProjectProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-fg-muted text-xs uppercase tracking-wider">
          Project
        </span>
      </div>
      <h2 className="text-fg font-semibold text-lg flex-wrap flex">{title}</h2>
      <p className="text-fg-muted text-sm">{tecnologies}</p>
      <ProgressBar current={current} label="Task" total={total} color={color} />
    </div>
  );
}
