import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("Header Component", () => {
  beforeEach(() => {});

  test("renders Heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /task manager app/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
