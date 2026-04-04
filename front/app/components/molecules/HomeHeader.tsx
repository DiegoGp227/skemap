"use client";

import useProjectsStats from "@/src/home/hooks/useProjectsStats";

export default function HomeHeader() {
  const { error, loading, stats } = useProjectsStats();
  return (
    <div>
      <div>
        <h1 className="text-3xl text-fg">Projects</h1>
      </div>
      <div className="flex gap-2">
        {loading ? (
          "loading..."
        ) : (
          <>
            <p className="text-fg-muted">{stats.active} Actives</p>
            <span className="text-fg-muted">•</span>
            <p className="text-fg-muted">{stats.completed} Complete</p>
            <span className="text-fg-muted">•</span>
            <p className="text-fg-muted">{stats.archived} Archivate</p>
          </>
        )}
      </div>
    </div>
  );
}
