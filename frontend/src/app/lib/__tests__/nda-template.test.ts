import { describe, it, expect } from "vitest";
import { renderCoverPage, renderStandardTerms } from "../nda-template";
import { defaultFormData } from "../types";
import type { NDAFormData } from "../types";

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
    modifications: "Section 5 is amended to extend the notice period to 60 days.",
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

describe("renderCoverPage", () => {
  it("should return an HTML string", () => {
    const result = renderCoverPage(defaultFormData);
    expect(typeof result).toBe("string");
    expect(result).toContain("<h1>");
  });

  it("should include the Mutual NDA title", () => {
    const result = renderCoverPage(defaultFormData);
    expect(result).toContain("Mutual Non-Disclosure Agreement");
  });

  it("should render the purpose", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Evaluating a potential merger");
  });

  it("should show placeholder when purpose is empty", () => {
    const data = { ...defaultFormData, purpose: "" };
    const result = renderCoverPage(data);
    expect(result).toContain("[Purpose]");
  });

  it("should render the effective date formatted", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("March 1, 2026");
  });

  it("should show [Date] when effectiveDate is empty", () => {
    const data = { ...defaultFormData, effectiveDate: "" };
    const result = renderCoverPage(data);
    expect(result).toContain("[Date]");
  });

  it("should render expires term type", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Expires 2 year(s) from Effective Date.");
  });

  it("should render untilTerminated term type", () => {
    const data = { ...filledFormData(), mndaTermType: "untilTerminated" as const };
    const result = renderCoverPage(data);
    expect(result).toContain(
      "Continues until terminated in accordance with the terms of the MNDA."
    );
  });

  it("should default mndaTermYears to 1 when empty", () => {
    const data = { ...defaultFormData, mndaTermYears: "  " };
    const result = renderCoverPage(data);
    expect(result).toContain("Expires 1 year(s) from Effective Date.");
  });

  it("should render years confidentiality term", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("3 year(s) from Effective Date");
    expect(result).toContain("trade secret");
  });

  it("should render perpetuity confidentiality term", () => {
    const data = {
      ...filledFormData(),
      confidentialityTermType: "perpetuity" as const,
    };
    const result = renderCoverPage(data);
    expect(result).toContain("In perpetuity.");
  });

  it("should default confidentialityTermYears to 1 when empty", () => {
    const data = { ...defaultFormData, confidentialityTermYears: "" };
    const result = renderCoverPage(data);
    expect(result).toContain("1 year(s) from Effective Date");
  });

  it("should render governing law", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Governing Law: Delaware");
  });

  it("should show [State] placeholder when governing law is empty", () => {
    const data = { ...defaultFormData, governingLaw: "" };
    const result = renderCoverPage(data);
    expect(result).toContain("Governing Law: [State]");
  });

  it("should render jurisdiction", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Jurisdiction: courts located in New Castle, DE");
  });

  it("should show placeholder when jurisdiction is empty", () => {
    const data = { ...defaultFormData, jurisdiction: "" };
    const result = renderCoverPage(data);
    expect(result).toContain("Jurisdiction: [City/County and State]");
  });

  it("should include modifications when present", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("MNDA Modifications");
    expect(result).toContain(
      "Section 5 is amended to extend the notice period to 60 days."
    );
  });

  it("should exclude modifications section when empty", () => {
    const data = { ...filledFormData(), modifications: "" };
    const result = renderCoverPage(data);
    expect(result).not.toContain("MNDA Modifications");
  });

  it("should exclude modifications section when only whitespace", () => {
    const data = { ...filledFormData(), modifications: "   " };
    const result = renderCoverPage(data);
    expect(result).not.toContain("MNDA Modifications");
  });

  it("should render party1 details in table", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Alice Johnson");
    expect(result).toContain("CEO");
    expect(result).toContain("Alpha Corp");
    expect(result).toContain("alice@alphacorp.com");
  });

  it("should render party2 details in table", () => {
    const data = filledFormData();
    const result = renderCoverPage(data);
    expect(result).toContain("Bob Smith");
    expect(result).toContain("CTO");
    expect(result).toContain("Beta Inc");
    expect(result).toContain("bob@betainc.com");
  });

  it("should include PARTY 1 and PARTY 2 headers", () => {
    const result = renderCoverPage(defaultFormData);
    expect(result).toContain("PARTY 1");
    expect(result).toContain("PARTY 2");
  });

  it("should include signature lines", () => {
    const result = renderCoverPage(defaultFormData);
    expect(result).toContain("Signature");
    expect(result).toContain("____________________");
  });

  it("should include CC BY 4.0 license attribution", () => {
    const result = renderCoverPage(defaultFormData);
    expect(result).toContain("CC BY 4.0");
    expect(result).toContain("commonpaper.com");
  });

  it("should include the CommonPaper standard link", () => {
    const result = renderCoverPage(defaultFormData);
    expect(result).toContain(
      "https://commonpaper.com/standards/mutual-nda/1.0"
    );
  });
});

describe("renderStandardTerms", () => {
  it("should return an HTML string", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(typeof result).toBe("string");
    expect(result).toContain("<h1>");
  });

  it("should include Standard Terms heading", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(result).toContain("Standard Terms");
  });

  it("should contain all 11 numbered sections", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(result).toContain("Introduction");
    expect(result).toContain("Use and Protection of Confidential Information");
    expect(result).toContain("Exceptions");
    expect(result).toContain("Disclosures Required by Law");
    expect(result).toContain("Term and Termination");
    expect(result).toContain("Return or Destruction of Confidential Information");
    expect(result).toContain("Proprietary Rights");
    expect(result).toContain("Disclaimer");
    expect(result).toContain("Governing Law and Jurisdiction");
    expect(result).toContain("Equitable Relief");
    expect(result).toContain("General");
  });

  it("should use <ol> for numbered sections", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(result).toContain("<ol>");
    expect(result).toContain("</ol>");
  });

  it("should interpolate purpose in Introduction section", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("Evaluating a potential merger");
  });

  it("should show purpose placeholder when empty", () => {
    const data = { ...defaultFormData, purpose: "" };
    const result = renderStandardTerms(data);
    expect(result).toContain("[Purpose]");
  });

  it("should highlight interpolated values with <mark> tags", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("<mark>");
    expect(result).toContain("</mark>");
  });

  it("should render expires term in section 5", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("2 year(s) from Effective Date");
  });

  it("should render untilTerminated in section 5", () => {
    const data = {
      ...filledFormData(),
      mndaTermType: "untilTerminated" as const,
    };
    const result = renderStandardTerms(data);
    expect(result).toContain("until terminated");
  });

  it("should render years confidentiality term", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("3 year(s) from Effective Date");
  });

  it("should render perpetuity confidentiality term", () => {
    const data = {
      ...filledFormData(),
      confidentialityTermType: "perpetuity" as const,
    };
    const result = renderStandardTerms(data);
    expect(result).toContain("perpetuity");
  });

  it("should render the effective date in section 5", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("March 1, 2026");
  });

  it("should render governing law in section 9", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    // The governing law is wrapped in a <mark> tag: State of <mark>Delaware</mark>
    expect(result).toMatch(/State of\s*<mark>Delaware<\/mark>/);
  });

  it("should show [State] placeholder for empty governing law", () => {
    const data = { ...defaultFormData, governingLaw: "" };
    const result = renderStandardTerms(data);
    expect(result).toMatch(/State of\s*<mark>\[State\]<\/mark>/);
  });

  it("should render jurisdiction in section 9", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    expect(result).toContain("courts located in New Castle, DE");
  });

  it("should show [Jurisdiction] placeholder for empty jurisdiction", () => {
    const data = { ...defaultFormData, jurisdiction: "" };
    const result = renderStandardTerms(data);
    expect(result).toContain("[Jurisdiction]");
  });

  it("should include CC BY 4.0 license", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(result).toContain("CC BY 4.0");
  });

  it("should include CommonPaper version link", () => {
    const result = renderStandardTerms(defaultFormData);
    expect(result).toContain(
      "https://commonpaper.com/standards/mutual-nda/1.0/"
    );
  });

  it("should interpolate purpose in multiple locations", () => {
    const data = filledFormData();
    const result = renderStandardTerms(data);
    // Purpose appears in sections 1 and 2
    const matches = result.match(/Evaluating a potential merger/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(3);
  });
});

describe("edge cases", () => {
  it("should handle whitespace-only string fields gracefully", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      purpose: "   ",
      governingLaw: "   ",
      jurisdiction: "   ",
      party1: { name: "  ", title: "  ", company: "  ", noticeAddress: "  " },
      party2: { name: "  ", title: "  ", company: "  ", noticeAddress: "  " },
    };

    const cover = renderCoverPage(data);
    const terms = renderStandardTerms(data);

    expect(cover).toContain("[Purpose]");
    expect(cover).toContain("[State]");
    expect(terms).toContain("[Purpose]");
    expect(terms).toContain("[State]");
  });

  it("should handle very long input strings without error", () => {
    const longString = "A".repeat(10000);
    const data: NDAFormData = {
      ...defaultFormData,
      purpose: longString,
    };

    const cover = renderCoverPage(data);
    expect(cover).toContain(longString);
  });

  it("should handle special characters in input", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      purpose: 'Evaluate "Project X" & co-development',
      governingLaw: "New York",
    };

    const cover = renderCoverPage(data);
    expect(cover).toContain('Evaluate "Project X" & co-development');
  });

  it("should handle date edge cases", () => {
    const data = { ...defaultFormData, effectiveDate: "2025-12-31" };
    const cover = renderCoverPage(data);
    expect(cover).toContain("December 31, 2025");
  });

  it("should handle January 1 date correctly", () => {
    const data = { ...defaultFormData, effectiveDate: "2026-01-01" };
    const cover = renderCoverPage(data);
    expect(cover).toContain("January 1, 2026");
  });
});
