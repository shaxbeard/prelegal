"use client";

import { useRef } from "react";
import { NDAFormData } from "../lib/types";
import { renderCoverPage, renderStandardTerms } from "../lib/nda-template";

interface NDAPreviewProps {
  data: NDAFormData;
}

export default function NDAPreview({ data }: NDAPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  async function handleDownloadPDF() {
    const el = previewRef.current;
    if (!el) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    const party1 = data.party1.company || data.party1.name || "Party1";
    const party2 = data.party2.company || data.party2.name || "Party2";
    pdf.save(`Mutual-NDA-${party1}-${party2}.pdf`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Document Preview
        </h2>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Download PDF
        </button>
      </div>
      <div
        ref={previewRef}
        className="bg-white border border-gray-200 rounded-md p-8 shadow-inner nda-document"
        dangerouslySetInnerHTML={{
          __html: renderCoverPage(data) + "<hr />" + renderStandardTerms(data),
        }}
      />
    </div>
  );
}
