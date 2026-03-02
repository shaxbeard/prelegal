import { NDAFormData } from "./types";

function formatDate(dateStr: string): string {
  if (!dateStr) return "[Date]";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function or(value: string, placeholder: string): string {
  return value.trim() || placeholder;
}

export function renderCoverPage(data: NDAFormData): string {
  const mndaTerm =
    data.mndaTermType === "expires"
      ? `Expires ${or(data.mndaTermYears, "1")} year(s) from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const confidentialityTerm =
    data.confidentialityTermType === "years"
      ? `${or(data.confidentialityTermYears, "1")} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : "In perpetuity.";

  return `
<h1>Mutual Non-Disclosure Agreement</h1>

<h2>USING THIS MUTUAL NON-DISCLOSURE AGREEMENT</h2>

<p>This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at <a href="https://commonpaper.com/standards/mutual-nda/1.0">commonpaper.com/standards/mutual-nda/1.0</a>. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.</p>

<h3>Purpose</h3>
<p><em>How Confidential Information may be used</em></p>
<p>${or(data.purpose, "[Purpose]")}</p>

<h3>Effective Date</h3>
<p>${formatDate(data.effectiveDate)}</p>

<h3>MNDA Term</h3>
<p><em>The length of this MNDA</em></p>
<p>${mndaTerm}</p>

<h3>Term of Confidentiality</h3>
<p><em>How long Confidential Information is protected</em></p>
<p>${confidentialityTerm}</p>

<h3>Governing Law &amp; Jurisdiction</h3>
<p>Governing Law: ${or(data.governingLaw, "[State]")}</p>
<p>Jurisdiction: ${or(data.jurisdiction, "[City/County and State]")}</p>

${data.modifications.trim() ? `<h3>MNDA Modifications</h3>\n<p>${data.modifications}</p>` : ""}

<p>By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.</p>

<table>
  <thead>
    <tr><th></th><th>PARTY 1</th><th>PARTY 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Print Name</td><td>${or(data.party1.name, "")}</td><td>${or(data.party2.name, "")}</td></tr>
    <tr><td>Title</td><td>${or(data.party1.title, "")}</td><td>${or(data.party2.title, "")}</td></tr>
    <tr><td>Company</td><td>${or(data.party1.company, "")}</td><td>${or(data.party2.company, "")}</td></tr>
    <tr><td>Notice Address</td><td>${or(data.party1.noticeAddress, "")}</td><td>${or(data.party2.noticeAddress, "")}</td></tr>
    <tr><td>Date</td><td>${formatDate(data.effectiveDate)}</td><td>${formatDate(data.effectiveDate)}</td></tr>
    <tr><td>Signature</td><td>____________________</td><td>____________________</td></tr>
  </tbody>
</table>

<p><small>Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</small></p>
`;
}

export function renderStandardTerms(data: NDAFormData): string {
  const mndaTerm =
    data.mndaTermType === "expires"
      ? `${or(data.mndaTermYears, "1")} year(s) from Effective Date`
      : "until terminated";

  const confidentialityTerm =
    data.confidentialityTermType === "years"
      ? `${or(data.confidentialityTermYears, "1")} year(s) from Effective Date`
      : "perpetuity";

  return `
<h1>Standard Terms</h1>

<ol>
<li><strong>Introduction</strong>. This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in connection with the <mark>${or(data.purpose, "[Purpose]")}</mark> which (1) the Disclosing Party identifies to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure (&ldquo;<strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also includes the existence and status of the parties&rsquo; discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.</li>

<li><strong>Use and Protection of Confidential Information</strong>. The Receiving Party shall: (a) use Confidential Information solely for the <mark>${or(data.purpose, "[Purpose]")}</mark>; (b) not disclose Confidential Information to third parties without the Disclosing Party&rsquo;s prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the <mark>${or(data.purpose, "[Purpose]")}</mark>, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.</li>

<li><strong>Exceptions</strong>. The Receiving Party&rsquo;s obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.</li>

<li><strong>Disclosures Required by Law</strong>. The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to obtain confidential treatment for the Confidential Information.</li>

<li><strong>Term and Termination</strong>. This MNDA commences on the <mark>${formatDate(data.effectiveDate)}</mark> and expires at the end of the <mark>${mndaTerm}</mark>. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party&rsquo;s obligations relating to Confidential Information will survive for the <mark>${confidentialityTerm}</mark>, despite any expiration or termination of this MNDA.</li>

<li><strong>Return or Destruction of Confidential Information</strong>. Upon expiration or termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party&rsquo;s written request, destroy all Confidential Information in the Receiving Party&rsquo;s possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.</li>

<li><strong>Proprietary Rights</strong>. The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.</li>

<li><strong>Disclaimer</strong>. ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</li>

<li><strong>Governing Law and Jurisdiction</strong>. This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of <mark>${or(data.governingLaw, "[State]")}</mark>, without regard to the conflict of laws provisions of such State. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in <mark>${or(data.jurisdiction, "[Jurisdiction]")}</mark>. Each party irrevocably submits to the exclusive jurisdiction of such courts in any such suit, action, or proceeding.</li>

<li><strong>Equitable Relief</strong>. A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.</li>

<li><strong>General</strong>. Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must be signed by the waiving party&rsquo;s authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.</li>
</ol>

<p><small>Common Paper Mutual Non-Disclosure Agreement <a href="https://commonpaper.com/standards/mutual-nda/1.0/">Version 1.0</a> free to use under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</small></p>
`;
}
