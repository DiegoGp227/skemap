import EpicDiv from "../molecules/EpicDiv";

export default function EpicSecction() {
  return (
    <div className="gap-8 p-4">
      <p>Epics</p>
      <EpicDiv title="Launch MVP" progress="3/10" color="#22c55e" />
      <EpicDiv title="Design System" progress="7/10" color="#3b82f6" />
      <EpicDiv title="Fix Bugs" progress="5/10" color="#ef4444" />
      <EpicDiv title="User Testing" progress="2/10" color="#f59e0b" />
      <EpicDiv title="Refactor Backend" progress="8/10" color="#14b8a6" />
      <EpicDiv title="Write Docs" progress="1/10" color="#a855f7" />
      <EpicDiv title="Deploy v1.0" progress="9/10" color="#10b981" />
      <EpicDiv title="SEO Optimization" progress="4/10" color="#f97316" />
    </div>
  );
}
