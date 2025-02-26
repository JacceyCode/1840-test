import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskTable from "@/components/TaskTable";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const renderWithProviders = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("TaskTable Component", () => {
  beforeEach(() => {
    renderWithProviders(<TaskTable />);
  });

  test("Add task button should be rendered", () => {
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  test("No task text should be rendered", () => {
    expect(
      screen.getByRole("heading", {
        name: /No tasks recorded yet. Kindly create a new task./i,
      })
    ).toBeInTheDocument();
  });

  test("Table should not be rendered", () => {
    expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Due Date/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/priority/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument();
  });
});
