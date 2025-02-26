export const saveTask = (tasks: Task[]) => {
  // Save to storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const getAllTasks = () => {
  const tasks = localStorage.getItem("tasks");

  if (!tasks) return [];

  return JSON.parse(tasks);
};
