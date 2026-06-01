/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats
 * Base block: cards
 * Source: https://www.medtronic.com/en-ca/index.html
 * Selector: #container-d0b51fad6e
 * Generated: 2026-06-01
 *
 * Extracts stat cards with icon image, large stat number, and description label.
 * Each card becomes a row with two cells: [image] | [stat number + description]
 * The element is the cmp-container with id container-d0b51fad6e.
 * Inside it, an .aem-Grid contains 3 stat card children (.container.responsivegrid.pad-left)
 * and possibly a link/text element.
 */
export default function parse(element, { document }) {
  // Stat cards are .container.responsivegrid.pad-left descendants
  // They may be direct children of element or nested inside an .aem-Grid
  const statCards = element.querySelectorAll('.container.responsivegrid.pad-left');

  const cells = [];

  statCards.forEach((card) => {
    // Extract icon image
    const image = card.querySelector('img');

    // Extract stat number from .text-color-link container
    // The number is in a .text-heading-xlarge span inside a paragraph
    const statNumberEl = card.querySelector('.text-heading-xlarge');
    // Fallback: look in text-color-link div
    const statFallback = card.querySelector('.text-color-link p');

    // Extract description text from the .text div that does NOT have text-color-link class
    const descriptionEl = card.querySelector('.text:not(.text-color-link) .text-body-large');
    // Fallback: second .text div's paragraph
    const descFallback = card.querySelector('.text:not(.text-color-link) p');

    const statText = statNumberEl
      ? statNumberEl.textContent.trim()
      : (statFallback ? statFallback.textContent.trim() : '');

    const descText = descriptionEl
      ? descriptionEl.textContent.trim()
      : (descFallback ? descFallback.textContent.trim() : '');

    // Only create a row if we have meaningful stat content
    if (!statText && !image) return;

    // Build the content cell: stat number (bold) + line break + description
    const contentCell = [];

    if (statText) {
      const strong = document.createElement('strong');
      strong.textContent = statText;
      contentCell.push(strong);
    }

    if (descText) {
      const br = document.createElement('br');
      contentCell.push(br);
      const desc = document.createTextNode(descText);
      contentCell.push(desc);
    }

    // Row: [image cell, content cell with stat + description]
    if (image) {
      cells.push([image, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
