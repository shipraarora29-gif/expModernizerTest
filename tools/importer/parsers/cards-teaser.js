/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-teaser
 * Base block: cards
 * Source: https://www.medtronic.com/en-ca/index.html
 * Selector: .cmp-teaser
 * Generated: 2026-06-01
 *
 * Extracts teaser cards with image, eyebrow text, linked title, and optional description.
 * Each .cmp-teaser element produces one row in the Cards block table.
 */
export default function parse(element, { document }) {
  // Extract image from teaser
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image');

  // Extract eyebrow/pretitle text
  const pretitle = element.querySelector('.cmp-teaser__pretitle, p[class*="pretitle"]');

  // Extract linked title (h2 with anchor)
  const titleLink = element.querySelector('.cmp-teaser__title-link, .cmp-teaser__title a');
  const titleHeading = element.querySelector('h2.cmp-teaser__title, h2, h3');

  // Extract optional description
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description');

  // Build the content cell: eyebrow + linked heading + optional description
  const contentCell = [];

  if (pretitle) {
    contentCell.push(pretitle);
  }

  // Reconstruct heading with link preserved
  if (titleHeading) {
    contentCell.push(titleHeading);
  }

  if (description) {
    contentCell.push(description);
  }

  // Build cells array: each row is [image cell, content cell]
  const cells = [];

  // Single row: image | content (eyebrow, title, description)
  const imageCell = image ? [image] : [];
  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
