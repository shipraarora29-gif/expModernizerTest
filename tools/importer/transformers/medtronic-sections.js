/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: medtronic sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Handles both templates dynamically via payload.template.sections:
 *
 * product-category-page (2 sections):
 *   1. Hero Section - selector: .hero-banner (style: null)
 *   2. Product Listing Section - selector: .container.responsivegrid.mdt-container (style: null)
 *
 * homepage (6 sections):
 *   1. Hero Section - selector: .hero-main-content (style: null)
 *   2. Teasers Section - selector: #container-f85633ca34 (style: null)
 *   3. Who We Are Section - selector: #container-da1dd1a5b3 (style: dark)
 *   4. Health Equity Section - selector: #container-eb3e077ff0 (style: dark)
 *   5. Our Impact Section - selector: #container-c5b1b5c864 (style: highlight)
 *   6. Careers Section - selector: #container-3d3f1fa609 (style: dark)
 *
 * All selectors verified against captured DOM of:
 * - https://www.medtronic.com/en-ca/index.html (homepage)
 * - https://www.medtronic.com/en-ca/healthcare-professionals/products/access-instruments.html (product-category-page)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid shifting indices
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before non-first sections to create section breaks
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
