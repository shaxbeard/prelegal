"use client";

import { NDAFormData, PartyInfo } from "../lib/types";

interface NDAFormProps {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (p: PartyInfo) => void;
}) {
  return (
    <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
      <legend className="text-sm font-semibold text-gray-800 px-1">
        {label}
      </legend>
      <TextInput
        label="Full Name"
        value={party.name}
        onChange={(v) => onChange({ ...party, name: v })}
        placeholder="Jane Smith"
      />
      <TextInput
        label="Title"
        value={party.title}
        onChange={(v) => onChange({ ...party, title: v })}
        placeholder="CEO"
      />
      <TextInput
        label="Company"
        value={party.company}
        onChange={(v) => onChange({ ...party, company: v })}
        placeholder="Acme Corp"
      />
      <TextInput
        label="Notice Address"
        value={party.noticeAddress}
        onChange={(v) => onChange({ ...party, noticeAddress: v })}
        placeholder="Email or postal address"
      />
    </fieldset>
  );
}

export default function NDAForm({ data, onChange }: NDAFormProps) {
  function update(partial: Partial<NDAFormData>) {
    onChange({ ...data, ...partial });
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purpose
        </label>
        <textarea
          value={data.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Effective Date
        </label>
        <input
          type="date"
          value={data.effectiveDate}
          onChange={(e) => update({ effectiveDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MNDA Term
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === "expires"}
              onChange={() => update({ mndaTermType: "expires" })}
            />
            Expires after
            <input
              type="number"
              min="1"
              value={data.mndaTermYears}
              onChange={(e) => update({ mndaTermYears: e.target.value })}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
              disabled={data.mndaTermType !== "expires"}
            />
            year(s)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === "untilTerminated"}
              onChange={() => update({ mndaTermType: "untilTerminated" })}
            />
            Continues until terminated
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Term of Confidentiality
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "years"}
              onChange={() => update({ confidentialityTermType: "years" })}
            />
            <input
              type="number"
              min="1"
              value={data.confidentialityTermYears}
              onChange={(e) =>
                update({ confidentialityTermYears: e.target.value })
              }
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
              disabled={data.confidentialityTermType !== "years"}
            />
            year(s) (trade secrets protected until no longer trade secrets)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "perpetuity"}
              onChange={() => update({ confidentialityTermType: "perpetuity" })}
            />
            In perpetuity
          </label>
        </div>
      </div>

      <TextInput
        label="Governing Law (State)"
        value={data.governingLaw}
        onChange={(v) => update({ governingLaw: v })}
        placeholder="e.g. Delaware"
      />

      <TextInput
        label="Jurisdiction"
        value={data.jurisdiction}
        onChange={(v) => update({ jurisdiction: v })}
        placeholder='e.g. "courts located in New Castle, DE"'
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MNDA Modifications (optional)
        </label>
        <textarea
          value={data.modifications}
          onChange={(e) => update({ modifications: e.target.value })}
          rows={2}
          placeholder="List any modifications to the standard terms..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <PartyFields
        label="Party 1"
        party={data.party1}
        onChange={(p) => update({ party1: p })}
      />

      <PartyFields
        label="Party 2"
        party={data.party2}
        onChange={(p) => update({ party2: p })}
      />
    </form>
  );
}
