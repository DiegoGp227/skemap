export default function HeaderProjectsInfo() {
  return (
    <div>
      <div>
        <h1 className="text-3xl text-fg">Projects</h1>
      </div>
      <div className="flex gap-2">
        <p className="text-fg-muted">1 Actives</p>
        <span className="text-fg-muted">•</span>
        <p className="text-fg-muted">2 Complete</p>
        <span className="text-fg-muted">•</span>
        <p className="text-fg-muted">3 Archivate</p>
      </div>
    </div>
  );
}
