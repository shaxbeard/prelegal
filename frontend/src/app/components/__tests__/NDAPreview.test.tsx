import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NDAPreview from "../NDAPreview";
import { defaultFormData } from "../../lib/types";
import type { NDAFormData } from "../../lib/types";

// Mock html2canvas and jspdf since they rely on canvas APIs not available in jsdom
const mockCanvas = {
  width: 800,
  height: 1200,
  toDataURL: vi.fn().mockReturnValue("data:image/png;base64,mock"),
};

const mockHtml2canvas = vi.fn().mockResolvedValue(mockCanvas);

vi.mock("html2canvas", () => ({
  default: mockHtml2canvas,
}));

const mockSave = vi.fn();
const mockAddImage = vi.fn();
const mockAddPage = vi.fn();

vi.mock("jspdf", () => ({
  default: class MockJsPDF {
    addImage = mockAddImage;
    addPage = mockAddPage;
    save = mockSave;
  },
}));

function filledFormData(): NDAFormData {
  return {
    purpose: "Evaluating a potential merger",
    effectiveDate: "2026-03-01",
    mndaTermType: "expires",
    mndaTermYears: "2",
    confidentialityTermType: "years",
    confidentialityTermYears: "3",
    governingLaw: "Delaware",
    jurisdiction: "courts located in New Castle, DE",
    modifications: "",
    party1: {
      name: "Alice Johnson",
      title: "CEO",
      company: "Alpha Corp",
      noticeAddress: "alice@alphacorp.com",
    },
    party2: {
      name: "Bob Smith",
      title: "CTO",
      company: "Beta Inc",
      noticeAddress: "bob@betainc.com",
    },
  };
}

describe("NDAPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the Document Preview heading", () => {
      render(<NDAPreview data={defaultFormData} />);
      expect(screen.getByText("Document Preview")).toBeInTheDocument();
    });

    it("should render the Download PDF button", () => {
      render(<NDAPreview data={defaultFormData} />);
      expect(
        screen.getByRole("button", { name: "Download PDF" })
      ).toBeInTheDocument();
    });

    it("should render the NDA document content via dangerouslySetInnerHTML", () => {
      render(<NDAPreview data={filledFormData()} />);
      expect(
        screen.getByText("Mutual Non-Disclosure Agreement")
      ).toBeInTheDocument();
    });

    it("should render the cover page content", () => {
      render(<NDAPreview data={filledFormData()} />);
      // Purpose appears in multiple sections (cover page + standard terms)
      const matches = screen.getAllByText("Evaluating a potential merger");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("should render the standard terms content", () => {
      render(<NDAPreview data={filledFormData()} />);
      // "Standard Terms" appears in both a <strong> and <h1> in the rendered NDA
      const matches = screen.getAllByText("Standard Terms");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("should render party names in the cover page table", () => {
      render(<NDAPreview data={filledFormData()} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });

    it("should have the nda-document class on the preview container", () => {
      render(<NDAPreview data={filledFormData()} />);
      const container = screen
        .getByText("Mutual Non-Disclosure Agreement")
        .closest(".nda-document");
      expect(container).not.toBeNull();
    });
  });

  describe("PDF download", () => {
    it("should save PDF with party company names in filename", async () => {
      const user = userEvent.setup();
      render(<NDAPreview data={filledFormData()} />);

      const button = screen.getByRole("button", { name: "Download PDF" });
      await user.click(button);

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          "Mutual-NDA-Alpha Corp-Beta Inc.pdf"
        );
      });
    });

    it("should use party names when company is empty", async () => {
      const user = userEvent.setup();
      const data = {
        ...filledFormData(),
        party1: { name: "Alice", title: "", company: "", noticeAddress: "" },
        party2: { name: "Bob", title: "", company: "", noticeAddress: "" },
      };
      render(<NDAPreview data={data} />);

      const button = screen.getByRole("button", { name: "Download PDF" });
      await user.click(button);

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith("Mutual-NDA-Alice-Bob.pdf");
      });
    });

    it("should use fallback names when both name and company are empty", async () => {
      const user = userEvent.setup();
      const data = {
        ...filledFormData(),
        party1: { name: "", title: "", company: "", noticeAddress: "" },
        party2: { name: "", title: "", company: "", noticeAddress: "" },
      };
      render(<NDAPreview data={data} />);

      const button = screen.getByRole("button", { name: "Download PDF" });
      await user.click(button);

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          "Mutual-NDA-Party1-Party2.pdf"
        );
      });
    });

    it("should generate A4-sized PDF", async () => {
      const user = userEvent.setup();
      render(<NDAPreview data={filledFormData()} />);

      const button = screen.getByRole("button", { name: "Download PDF" });
      await user.click(button);

      await waitFor(() => {
        expect(mockAddImage).toHaveBeenCalled();
      });
      const [, , , , width] = mockAddImage.mock.calls[0];
      expect(width).toBe(210);
    });
  });

  describe("reactivity", () => {
    it("should update preview when data changes", () => {
      const { rerender } = render(<NDAPreview data={defaultFormData} />);

      rerender(
        <NDAPreview
          data={{ ...defaultFormData, purpose: "New purpose value" }}
        />
      );

      // Purpose appears in multiple sections in the NDA template
      const matches = screen.getAllByText("New purpose value");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("should update preview when governing law changes", () => {
      const { rerender } = render(<NDAPreview data={defaultFormData} />);

      rerender(
        <NDAPreview
          data={{ ...defaultFormData, governingLaw: "California" }}
        />
      );

      expect(screen.getByText(/Governing Law: California/)).toBeInTheDocument();
    });

    it("should update preview when party info changes", () => {
      const { rerender } = render(<NDAPreview data={defaultFormData} />);

      rerender(
        <NDAPreview
          data={{
            ...defaultFormData,
            party1: {
              name: "New Name",
              title: "VP",
              company: "New Co",
              noticeAddress: "new@co.com",
            },
          }}
        />
      );

      expect(screen.getByText("New Name")).toBeInTheDocument();
      expect(screen.getByText("New Co")).toBeInTheDocument();
    });
  });
});
