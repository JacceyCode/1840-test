import TaskTable from "@/components/TaskTable";

export default function Home() {
  return (
    <main className="max-w-screen-2xl mx-auto bg-blue-500 min-h-screen relative">
      <header className="z-10 w-full sticky top-0 border-b border-color_5 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl p-6 h-[5rem]">
        <h1 className="text-center font-semibold text-xl lg:text-4xl">
          Task Manager App
        </h1>
      </header>
      <section className="bg-color_1 py-2 md:p-4">
        {/* <h2 className="text-2xl font-medium">
          No tasks recorded yet. Kindly create a new task.
        </h2> */}
        <TaskTable />
      </section>
    </main>
  );
}
