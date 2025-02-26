import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <section className="size-full flex items-center justify-center text-green-400">
      <Loader2 size={40} className="animate-spin" /> Loading...
    </section>
  );
};

export default Spinner;
