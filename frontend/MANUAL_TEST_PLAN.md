# Mutual NDA Creator - Manual Test Plan

## 1. Initial Page Load

- [ ] Page loads without errors
- [ ] "Prelegal" heading and "Mutual NDA Creator" subtitle visible
- [ ] Form panel appears on the left with "NDA Details" heading
- [ ] Document preview appears on the right with "Document Preview" heading
- [ ] "Download PDF" button is visible
- [ ] Default purpose text is pre-filled: "Evaluating whether to enter into a business relationship with the other party."
- [ ] Effective date defaults to today's date
- [ ] MNDA Term defaults to "Expires after 1 year(s)"
- [ ] Confidentiality term defaults to "1 year(s)"
- [ ] Preview shows the NDA with default values and placeholder text (e.g., "[State]", "[City/County and State]")

## 2. Form Fields

### Purpose
- [ ] Typing in the Purpose textarea updates the preview in real time
- [ ] Purpose text appears in the Cover Page section
- [ ] Purpose text appears in sections 1 and 2 of the Standard Terms (highlighted in yellow)
- [ ] Clearing the purpose shows "[Purpose]" placeholder in preview

### Effective Date
- [ ] Changing the date updates the formatted date in the preview (e.g., "March 1, 2026")
- [ ] Date appears in the Cover Page under "Effective Date"
- [ ] Date appears in Section 5 (Term and Termination) of Standard Terms
- [ ] Date appears in the signature table for both parties

### MNDA Term
- [ ] Selecting "Expires after X year(s)" shows "Expires X year(s) from Effective Date" in preview
- [ ] Changing the year count updates the preview
- [ ] Year input is disabled when "Continues until terminated" is selected
- [ ] Selecting "Continues until terminated" shows appropriate text in both Cover Page and Standard Terms
- [ ] Switching between options updates preview correctly each time

### Term of Confidentiality
- [ ] Selecting X year(s) shows the years-based text with trade secret language in Cover Page
- [ ] Year input is disabled when "In perpetuity" is selected
- [ ] Selecting "In perpetuity" shows "In perpetuity." in the Cover Page
- [ ] Standard Terms Section 5 updates with the correct confidentiality term

### Governing Law
- [ ] Typing a state name (e.g., "Delaware") updates both Cover Page and Standard Terms Section 9
- [ ] Cover Page shows "Governing Law: Delaware"
- [ ] Standard Terms shows "laws of the State of Delaware"
- [ ] Clearing the field shows placeholder text

### Jurisdiction
- [ ] Typing jurisdiction updates both Cover Page and Standard Terms Section 9
- [ ] Clearing the field shows placeholder text

### MNDA Modifications
- [ ] Leaving empty: no "MNDA Modifications" section appears in preview
- [ ] Typing modifications: "MNDA Modifications" heading and content appear in Cover Page
- [ ] Clearing all text: modifications section disappears from preview

### Party 1 and Party 2
- [ ] All four fields per party (Full Name, Title, Company, Notice Address) are present
- [ ] Typing in any field updates the corresponding cell in the Cover Page signature table
- [ ] Both parties' information is displayed side by side in the table
- [ ] Placeholders are shown for each field (Jane Smith, CEO, Acme Corp, Email or postal address)

## 3. Document Preview Content

- [ ] Cover Page includes the "USING THIS MUTUAL NON-DISCLOSURE AGREEMENT" section
- [ ] Link to commonpaper.com/standards/mutual-nda/1.0 is present and clickable
- [ ] Standard Terms includes all 11 numbered sections (Introduction through General)
- [ ] Signature line "____________________" appears for both parties
- [ ] CC BY 4.0 license attribution appears at the bottom of both Cover Page and Standard Terms
- [ ] A horizontal rule separates the Cover Page from Standard Terms
- [ ] User-entered values are highlighted in yellow (`<mark>` tags) in the Standard Terms

## 4. PDF Download

- [ ] Clicking "Download PDF" generates and downloads a PDF file
- [ ] PDF filename includes party company names (e.g., "Mutual-NDA-AlphaCorp-BetaInc.pdf")
- [ ] If company names are empty, party names are used in filename
- [ ] If both are empty, "Party1" and "Party2" are used
- [ ] PDF content matches the on-screen preview
- [ ] PDF is A4 sized
- [ ] Multi-page documents render correctly across pages (no missing content)
- [ ] Text is legible in the PDF
- [ ] Links in the PDF are blue and underlined (may not be clickable as it's image-based)

## 5. Responsive Design

- [ ] On large screens (>1024px): form on left, preview on right (side by side)
- [ ] On small screens (<1024px): form stacks above preview
- [ ] Form sidebar is sticky and scrollable on large screens
- [ ] Form sidebar has a max height with overflow scrolling
- [ ] Preview section adapts to available width

## 6. Edge Cases

- [ ] Very long text in any field doesn't break the layout
- [ ] Special characters (quotes, ampersands, angle brackets) display correctly in preview
- [ ] Rapid typing doesn't cause lag or missed updates
- [ ] Form does not submit/navigate when pressing Enter
- [ ] Empty form still generates a valid PDF with placeholder text

## 7. Cross-Browser Testing

- [ ] Chrome: all features work
- [ ] Firefox: all features work
- [ ] Safari: all features work
- [ ] Edge: all features work

## 8. Accessibility

- [ ] All form fields have associated labels
- [ ] Tab order follows logical reading order
- [ ] Radio buttons are grouped and keyboard-navigable
- [ ] Download button is keyboard-accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader can navigate the form fields
