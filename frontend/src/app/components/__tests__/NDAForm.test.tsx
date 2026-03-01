import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NDAForm from "../NDAForm";
import { defaultFormData } from "../../lib/types";
import type { NDAFormData } from "../../lib/types";

function renderForm(overrides?: Partial<NDAFormData>) {
  const data = { ...defaultFormData, ...overrides };
  const onChange = vi.fn();
  const result = render(<NDAForm data={data} onChange={onChange} />);
  const form = result.container.querySelector("form")!;
  return { data, onChange, form, ...result };
}

describe("NDAForm", () => {
  describe("rendering", () => {
    it("should render the form element", () => {
      const { form } = renderForm();
      expect(form).toBeInTheDocument();
    });

    it("should render the Purpose textarea", () => {
      renderForm();
      expect(screen.getByText("Purpose")).toBeInTheDocument();
      const textareas = screen.getAllByRole("textbox");
      expect(textareas.length).toBeGreaterThan(0);
    });

    it("should render the Effective Date input", () => {
      renderForm();
      expect(screen.getByText("Effective Date")).toBeInTheDocument();
    });

    it("should render MNDA Term radio buttons", () => {
      renderForm();
      const radios = screen.getAllByRole("radio");
      expect(radios.length).toBe(4); // 2 for MNDA + 2 for confidentiality
    });

    it("should render Governing Law input", () => {
      renderForm();
      expect(screen.getByText("Governing Law (State)")).toBeInTheDocument();
    });

    it("should render Jurisdiction input", () => {
      renderForm();
      expect(screen.getByText("Jurisdiction")).toBeInTheDocument();
    });

    it("should render MNDA Modifications textarea", () => {
      renderForm();
      expect(
        screen.getByText("MNDA Modifications (optional)")
      ).toBeInTheDocument();
    });

    it("should render Party 1 fieldset", () => {
      renderForm();
      expect(screen.getByText("Party 1")).toBeInTheDocument();
    });

    it("should render Party 2 fieldset", () => {
      renderForm();
      expect(screen.getByText("Party 2")).toBeInTheDocument();
    });

    it("should render 4 fields per party", () => {
      renderForm();
      const party1Fieldset = screen.getByText("Party 1").closest("fieldset")!;
      const party2Fieldset = screen.getByText("Party 2").closest("fieldset")!;

      expect(within(party1Fieldset).getAllByRole("textbox")).toHaveLength(4);
      expect(within(party2Fieldset).getAllByRole("textbox")).toHaveLength(4);
    });
  });

  describe("displaying values", () => {
    it("should display the purpose value", () => {
      renderForm({ purpose: "Test purpose" });
      expect(screen.getByDisplayValue("Test purpose")).toBeInTheDocument();
    });

    it("should display the effective date value", () => {
      renderForm({ effectiveDate: "2026-06-15" });
      expect(screen.getByDisplayValue("2026-06-15")).toBeInTheDocument();
    });

    it("should display governing law value", () => {
      renderForm({ governingLaw: "Delaware" });
      expect(screen.getByDisplayValue("Delaware")).toBeInTheDocument();
    });

    it("should display jurisdiction value", () => {
      renderForm({ jurisdiction: "New Castle, DE" });
      expect(screen.getByDisplayValue("New Castle, DE")).toBeInTheDocument();
    });

    it("should display modifications value", () => {
      renderForm({ modifications: "Custom modification" });
      expect(
        screen.getByDisplayValue("Custom modification")
      ).toBeInTheDocument();
    });

    it("should check expires radio when mndaTermType is expires", () => {
      renderForm({ mndaTermType: "expires" });
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
    });

    it("should check untilTerminated radio when selected", () => {
      renderForm({ mndaTermType: "untilTerminated" });
      const radios = screen.getAllByRole("radio");
      expect(radios[1]).toBeChecked();
    });

    it("should display party1 fields", () => {
      renderForm({
        party1: {
          name: "Alice",
          title: "CEO",
          company: "Alpha Corp",
          noticeAddress: "alice@alpha.com",
        },
      });

      const party1Fieldset = screen.getByText("Party 1").closest("fieldset")!;
      const inputs = within(party1Fieldset).getAllByRole("textbox");
      expect(inputs[0]).toHaveValue("Alice");
      expect(inputs[1]).toHaveValue("CEO");
      expect(inputs[2]).toHaveValue("Alpha Corp");
      expect(inputs[3]).toHaveValue("alice@alpha.com");
    });
  });

  describe("user interactions", () => {
    it("should call onChange when purpose is edited", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ purpose: "" });

      const textarea = screen.getByPlaceholderText(
        "List any modifications to the standard terms..."
      );
      // Get the first textarea (purpose) by finding it in the form
      const purposeTextarea = screen.getAllByRole("textbox")[0];
      await user.type(purposeTextarea, "A");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.purpose).toBe("A");
    });

    it("should call onChange when governing law changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ governingLaw: "" });

      const input = screen.getByPlaceholderText("e.g. Delaware");
      await user.type(input, "NY");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.governingLaw).toContain("Y");
    });

    it("should call onChange when jurisdiction changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ jurisdiction: "" });

      const input = screen.getByPlaceholderText(
        'e.g. "courts located in New Castle, DE"'
      );
      await user.type(input, "NYC");

      expect(onChange).toHaveBeenCalled();
    });

    it("should call onChange when modifications are edited", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ modifications: "" });

      const input = screen.getByPlaceholderText(
        "List any modifications to the standard terms..."
      );
      await user.type(input, "Mod");

      expect(onChange).toHaveBeenCalled();
    });

    it("should call onChange when party1 name changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const party1Fieldset = screen.getByText("Party 1").closest("fieldset")!;
      const nameInput = within(party1Fieldset).getAllByRole("textbox")[0];
      await user.type(nameInput, "A");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party1.name).toBe("A");
    });

    it("should call onChange when party2 name changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const party2Fieldset = screen.getByText("Party 2").closest("fieldset")!;
      const nameInput = within(party2Fieldset).getAllByRole("textbox")[0];
      await user.type(nameInput, "B");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party2.name).toBe("B");
    });

    it("should call onChange when MNDA term radio changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ mndaTermType: "expires" });

      const radios = screen.getAllByRole("radio");
      await user.click(radios[1]); // click untilTerminated

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.mndaTermType).toBe("untilTerminated");
    });

    it("should call onChange when confidentiality term radio changes", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm({ confidentialityTermType: "years" });

      const radios = screen.getAllByRole("radio");
      await user.click(radios[3]); // click perpetuity

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.confidentialityTermType).toBe("perpetuity");
    });

    it("should prevent form submission", () => {
      const { form } = renderForm();

      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });

      const defaultPrevented = !form.dispatchEvent(submitEvent);
      expect(defaultPrevented).toBe(true);
    });

    it("should disable MNDA term years input when untilTerminated is selected", () => {
      renderForm({ mndaTermType: "untilTerminated" });
      const yearInputs = screen.getAllByRole("spinbutton");
      expect(yearInputs[0]).toBeDisabled();
    });

    it("should enable MNDA term years input when expires is selected", () => {
      renderForm({ mndaTermType: "expires" });
      const yearInputs = screen.getAllByRole("spinbutton");
      expect(yearInputs[0]).not.toBeDisabled();
    });

    it("should disable confidentiality years input when perpetuity is selected", () => {
      renderForm({ confidentialityTermType: "perpetuity" });
      const yearInputs = screen.getAllByRole("spinbutton");
      expect(yearInputs[1]).toBeDisabled();
    });

    it("should enable confidentiality years input when years is selected", () => {
      renderForm({ confidentialityTermType: "years" });
      const yearInputs = screen.getAllByRole("spinbutton");
      expect(yearInputs[1]).not.toBeDisabled();
    });
  });

  describe("placeholders", () => {
    it("should show placeholder for party name", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Jane Smith");
      expect(inputs).toHaveLength(2); // one per party
    });

    it("should show placeholder for party title", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("CEO");
      expect(inputs).toHaveLength(2);
    });

    it("should show placeholder for company", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Acme Corp");
      expect(inputs).toHaveLength(2);
    });

    it("should show placeholder for notice address", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Email or postal address");
      expect(inputs).toHaveLength(2);
    });

    it("should show placeholder for governing law", () => {
      renderForm();
      expect(screen.getByPlaceholderText("e.g. Delaware")).toBeInTheDocument();
    });
  });
});
