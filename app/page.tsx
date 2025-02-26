import TaskTable from "@/components/TaskTable";

export default function Home() {
  return (
    <main className="max-w-screen-2xl mx-auto min-h-screen relative bg-color_1">
      <header className="z-10 w-full sticky top-0 border-b border-color_5 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl p-6 h-[5rem]">
        <h1 className="text-center font-semibold text-xl lg:text-4xl">
          Task Manager App
        </h1>
      </header>
      <section className="py-2 md:p-4">
        <TaskTable />
      </section>
    </main>
  );
}
