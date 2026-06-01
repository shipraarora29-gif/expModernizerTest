/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-category
 * Base block: hero
 * Source: https://www.medtronic.com/en-ca/healthcare-professionals/products/access-instruments.html
 * Selector: .hero-banner
 * Generated: 2026-06-01
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  // Validated selector: .hero-image img (from source.html line 7-8)
  const bgImage = element.querySelector('.hero-image img, img[class*="hero"], .mdt-hero-banner img');

  // Extract pre-title/eyebrow text
  // Validated selector: .pre-title (from source.html line 11)
  const preTitle = element.querySelector('.pre-title, .eyebrow, [class*="pre-title"]');

  // Extract main heading
  // Validated selector: h1 (from source.html line 12)
  const heading = element.querySelector('h1, h2, .hero-content h1, .content h1');

  // Extract CTA links (optional - empty in current instance but may exist on other pages)
  // Validated selector: .action-link a (from source.html line 13)
  const ctaLinks = Array.from(element.querySelectorAll('.action-link a, .hero-content a.cta, .hero-content a.button'));

  const cells = [];

  // Row 1: Hero image (per library example)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell - heading with optional eyebrow and CTAs (per library example)
  const contentCell = [];
  if (preTitle) contentCell.push(preTitle);
  if (heading) contentCell.push(heading);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-category', cells });
  element.replaceWith(block);
}
