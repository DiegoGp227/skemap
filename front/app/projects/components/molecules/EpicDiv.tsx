interface EpicDivProps {
  color: string;
  title: string;
  progress: string;
}

export default function EpicDiv({ color, title, progress }: EpicDivProps) {
  return (
    <button className="w-full flex items-center justify-between cursor-pointer hover:bg-overlay hover:text-fg transition duration-500 rounded py-1 px-3">
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div>{title}</div>
      <div>{progress}</div>
    </button>
  );
}
