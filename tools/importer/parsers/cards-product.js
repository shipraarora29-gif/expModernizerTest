/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source: https://www.medtronic.com/en-ca/healthcare-professionals/products/access-instruments.html
 * Selector: .productmodellist
 * Generated: 2026-06-01
 *
 * Extracts product cards from .productmodellist grid.
 * Each card has an image, title, and description wrapped in a link.
 * Output: one row per card with [image, title + description + link].
 */
export default function parse(element, { document }) {
  // Extract all product card items from the grid
  const cardItems = element.querySelectorAll('li.product-card-item, .product-card-item');

  const cells = [];

  cardItems.forEach((item) => {
    // Each card is wrapped in an anchor link
    const link = item.querySelector('a.product-card, a[href]');

    // Extract image
    const image = item.querySelector('img.product-image, .product-image-container img');

    // Extract title
    const title = item.querySelector('h3.product-title, .product-title, h3');

    // Extract description
    const description = item.querySelector('p.product-description, .product-description, p');

    // Build the content cell: title, description, and link
    const contentCell = [];

    if (title) {
      // Clone title and wrap in link if available
      if (link && link.getAttribute('href')) {
        const linkedTitle = document.createElement('h3');
        const anchor = document.createElement('a');
        anchor.href = link.getAttribute('href');
        anchor.textContent = title.textContent;
        linkedTitle.appendChild(anchor);
        contentCell.push(linkedTitle);
      } else {
        contentCell.push(title);
      }
    }

    if (description) {
      contentCell.push(description);
    }

    // Build row: [image cell, content cell]
    if (image || contentCell.length > 0) {
      const imageCell = image ? [image] : [''];
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
