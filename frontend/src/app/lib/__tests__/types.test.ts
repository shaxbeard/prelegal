import { describe, it, expect } from "vitest";
import { defaultFormData } from "../types";
import type { NDAFormData, PartyInfo } from "../types";

describe("PartyInfo type", () => {
  it("should have all required fields", () => {
    const party: PartyInfo = {
      name: "Jane Smith",
      title: "CEO",
      company: "Acme Corp",
      noticeAddress: "jane@acme.com",
    };

    expect(party.name).toBe("Jane Smith");
    expect(party.title).toBe("CEO");
    expect(party.company).toBe("Acme Corp");
    expect(party.noticeAddress).toBe("jane@acme.com");
  });
});

describe("NDAFormData type", () => {
  it("should have all required fields", () => {
    const data: NDAFormData = {
      purpose: "Business evaluation",
      effectiveDate: "2026-01-01",
      mndaTermType: "expires",
      mndaTermYears: "2",
      confidentialityTermType: "years",
      confidentialityTermYears: "3",
      governingLaw: "Delaware",
      jurisdiction: "New Castle, DE",
      modifications: "",
      party1: { name: "", title: "", company: "", noticeAddress: "" },
      party2: { name: "", title: "", company: "", noticeAddress: "" },
    };

    expect(data.mndaTermType).toBe("expires");
    expect(data.confidentialityTermType).toBe("years");
  });

  it("should accept untilTerminated for mndaTermType", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      mndaTermType: "untilTerminated",
    };
    expect(data.mndaTermType).toBe("untilTerminated");
  });

  it("should accept perpetuity for confidentialityTermType", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      confidentialityTermType: "perpetuity",
    };
    expect(data.confidentialityTermType).toBe("perpetuity");
  });
});

describe("defaultFormData", () => {
  it("should have a default purpose", () => {
    expect(defaultFormData.purpose).toBe(
      "Evaluating whether to enter into a business relationship with the other party."
    );
  });

  it("should set effectiveDate to today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(defaultFormData.effectiveDate).toBe(today);
  });

  it("should default mndaTermType to expires", () => {
    expect(defaultFormData.mndaTermType).toBe("expires");
  });

  it("should default mndaTermYears to 1", () => {
    expect(defaultFormData.mndaTermYears).toBe("1");
  });

  it("should default confidentialityTermType to years", () => {
    expect(defaultFormData.confidentialityTermType).toBe("years");
  });

  it("should default confidentialityTermYears to 1", () => {
    expect(defaultFormData.confidentialityTermYears).toBe("1");
  });

  it("should default governingLaw to empty string", () => {
    expect(defaultFormData.governingLaw).toBe("");
  });

  it("should default jurisdiction to empty string", () => {
    expect(defaultFormData.jurisdiction).toBe("");
  });

  it("should default modifications to empty string", () => {
    expect(defaultFormData.modifications).toBe("");
  });

  it("should have empty party1 fields", () => {
    expect(defaultFormData.party1).toEqual({
      name: "",
      title: "",
      company: "",
      noticeAddress: "",
    });
  });

  it("should have empty party2 fields", () => {
    expect(defaultFormData.party2).toEqual({
      name: "",
      title: "",
      company: "",
      noticeAddress: "",
    });
  });

  it("party1 and party2 should be separate objects", () => {
    expect(defaultFormData.party1).not.toBe(defaultFormData.party2);
  });
});
