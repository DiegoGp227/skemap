interface IProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export default function ProgressBar({ current, label, total }: IProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="bg-[#1c1c1e] px-4 py-2.5 rounded-md">
      <div className="flex justify-between mb-2">
        <span className="text-[#9a9a9e] text-sm">{current}/{total} {label}</span>
        <span className="text-amber-400 text-sm font-semibold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#2a2a2e] rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}