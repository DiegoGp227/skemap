export default function FilterProject() {
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <p>filter by state</p>
      <button className="cursor-pointer bg-surface w-full text-fg-muted hover:bg-overlay hover:text-fg transition duration-500 rounded">
        All
      </button>
      <button className="cursor-pointer bg-surface w-full text-fg-muted hover:bg-overlay hover:text-fg transition duration-500 rounded">
        To Do
      </button>
      <button className="cursor-pointer bg-surface w-full text-fg-muted hover:bg-overlay hover:text-fg transition duration-500 rounded">
        In Progress
      </button>
      <button className="cursor-pointer bg-surface w-full text-fg-muted hover:bg-overlay hover:text-fg transition duration-500 rounded">
        In Revision
      </button>
      <button className="cursor-pointer bg-surface w-full text-fg-muted hover:bg-overlay hover:text-fg transition duration-500 rounded">
        Complete
      </button>
    </div>
  );
}
