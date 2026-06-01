/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Source: https://www.medtronic.com/en-ca/index.html
 * Selector: .herobanner
 * Generated: 2026-06-01
 *
 * Source structure:
 *   .herobanner > .mdt-hero-banner
 *     .hero-image > img (background image)
 *     .hero-content > .content
 *       .pre-title (optional eyebrow text)
 *       h1.title (main heading)
 *       .description > p (description paragraph)
 *       .mdt-row.action-link > .button > a.cmp-button (CTA link)
 *
 * Target table (from library example):
 *   Row 1: background image
 *   Row 2: heading + description + CTA link
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  const heroImage = element.querySelector('.hero-image img, img[class*="hero"], img');

  // Extract pre-title/eyebrow (optional)
  const preTitle = element.querySelector('.pre-title, [class*="pre-title"], [class*="eyebrow"]');

  // Extract main heading
  const heading = element.querySelector('h1.title, h1, h2.title, h2, [class*="title"]:not(.pre-title)');

  // Extract description
  const description = element.querySelector('.description p, .description, p:not(.pre-title):not(.title)');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.action-link a.cmp-button, .button a.cmp-button, .action-link a, a.cmp-button, a.button'));

  // Build cells to match library example structure
  // Library example: Row 1 = image, Row 2 = single cell with heading + description + CTA
  const cells = [];

  // Row 1: Background image (single cell)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Content cell - all content in one cell container
  const contentContainer = document.createElement('div');

  if (preTitle) {
    contentContainer.appendChild(preTitle);
  }

  if (heading) {
    contentContainer.appendChild(heading);
  }

  if (description) {
    contentContainer.appendChild(description);
  }

  // Add CTA links
  ctaLinks.forEach((link) => {
    contentContainer.appendChild(link);
  });

  if (contentContainer.childNodes.length > 0) {
    cells.push([contentContainer]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
