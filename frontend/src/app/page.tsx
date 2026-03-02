"use client";

import { useState } from "react";
import NDAForm from "./components/NDAForm";
import NDAPreview from "./components/NDAPreview";
import { NDAFormData, defaultFormData } from "./lib/types";

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prelegal</h1>
            <p className="text-sm text-gray-500">Mutual NDA Creator</p>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          <aside className="bg-white border border-gray-200 rounded-lg p-6 h-fit lg:sticky lg:top-6 overflow-y-auto lg:max-h-[calc(100vh-120px)]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              NDA Details
            </h2>
            <NDAForm data={formData} onChange={setFormData} />
          </aside>

          <section className="min-w-0">
            <NDAPreview data={formData} />
          </section>
        </div>
      </main>
    </div>
  );
}
