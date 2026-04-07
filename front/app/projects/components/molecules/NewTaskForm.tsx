export default function NewTaskForm() {
  return (
    <form action="">
      <label htmlFor="taskTitle">Task Title</label>
      <input type="text" id="taskTitle" />

      <label htmlFor="description">Description</label>
      <input type="text" id="description" />

      <label htmlFor="priority">Priority</label>
      <select
        id="priority"
        name="priority"
        // className="px-3 py-2 rounded border border-border bg-background text-fg outline-none
        //        focus:ring-2 focus:ring-primary focus:border-primary
        //        transition duration-200 cursor-pointer"
        defaultValue="all"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <label htmlFor="technologies">Technologies</label>
      <input type="text" id="technologies" />
    </form>
  );
}
