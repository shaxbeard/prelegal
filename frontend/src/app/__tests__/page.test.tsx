import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

// Mock html2canvas and jspdf for NDAPreview
vi.mock("html2canvas", () => ({
  default: vi.fn().mockResolvedValue({
    width: 800,
    height: 1200,
    toDataURL: vi.fn().mockReturnValue("data:image/png;base64,mock"),
  }),
}));

vi.mock("jspdf", () => ({
  default: class MockJsPDF {
    addImage = vi.fn();
    addPage = vi.fn();
    save = vi.fn();
  },
}));

describe("Home page", () => {
  describe("layout", () => {
    it("should render the Prelegal heading", () => {
      render(<Home />);
      expect(screen.getByText("Prelegal")).toBeInTheDocument();
    });

    it("should render the Mutual NDA Creator subtitle", () => {
      render(<Home />);
      expect(screen.getByText("Mutual NDA Creator")).toBeInTheDocument();
    });

    it("should render the NDA Details sidebar heading", () => {
      render(<Home />);
      expect(screen.getByText("NDA Details")).toBeInTheDocument();
    });

    it("should render the Document Preview heading", () => {
      render(<Home />);
      expect(screen.getByText("Document Preview")).toBeInTheDocument();
    });

    it("should render the form", () => {
      const { container } = render(<Home />);
      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("should render the Download PDF button", () => {
      render(<Home />);
      expect(
        screen.getByRole("button", { name: "Download PDF" })
      ).toBeInTheDocument();
    });
  });

  describe("initial state", () => {
    it("should have default purpose text", () => {
      render(<Home />);
      expect(
        screen.getByDisplayValue(
          "Evaluating whether to enter into a business relationship with the other party."
        )
      ).toBeInTheDocument();
    });

    it("should have today's date as effective date", () => {
      render(<Home />);
      const today = new Date().toISOString().split("T")[0];
      expect(screen.getByDisplayValue(today)).toBeInTheDocument();
    });

    it("should show default purpose in preview", () => {
      const { container } = render(<Home />);
      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain(
        "Evaluating whether to enter into a business relationship"
      );
    });
  });

  describe("form-preview integration", () => {
    it("should update preview when purpose is changed", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const purposeTextarea = container.querySelector("textarea")!;
      await user.clear(purposeTextarea);
      await user.type(purposeTextarea, "Testing integration");

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain("Testing integration");
    });

    it("should update preview when governing law is changed", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const lawInput = screen.getByPlaceholderText("e.g. Delaware");
      await user.type(lawInput, "California");

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain("California");
    });

    it("should update preview when party1 name is entered", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const party1Fieldset = screen.getByText("Party 1").closest("fieldset")!;
      const nameInput = within(party1Fieldset).getAllByRole("textbox")[0];
      await user.type(nameInput, "Alice");

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain("Alice");
    });

    it("should update preview when party2 company is entered", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const party2Fieldset = screen.getByText("Party 2").closest("fieldset")!;
      const companyInput = within(party2Fieldset).getAllByRole("textbox")[2];
      await user.type(companyInput, "Beta Inc");

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain("Beta Inc");
    });

    it("should update preview when MNDA term type changes", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const radios = screen.getAllByRole("radio");
      await user.click(radios[1]); // untilTerminated

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain(
        "Continues until terminated"
      );
    });

    it("should update preview when confidentiality term changes to perpetuity", async () => {
      const user = userEvent.setup();
      const { container } = render(<Home />);

      const radios = screen.getAllByRole("radio");
      await user.click(radios[3]); // perpetuity

      const preview = container.querySelector(".nda-document")!;
      expect(preview.textContent).toContain("In perpetuity.");
    });
  });
});
