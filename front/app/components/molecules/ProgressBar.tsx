interface IProgressBarProps {
  current: number;
  total: number;
  label: string;
  color: string;
}

export default function ProgressBar({
  current,
  label,
  total,
  color,
}: IProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="py-2.5 rounded-md">
      <div className="flex justify-between mb-2">
        <span className="text-[#9a9a9e] text-sm">
          {current}/{total} {label}
        </span>
        <span className="text-sm font-semibold" style={{ color: color }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#2a2a2e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
