/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-split
 * Base block: columns
 * Source: https://www.medtronic.com/en-ca/index.html
 * Selectors: #container-da1dd1a5b3, #container-3d3f1fa609
 * Generated: 2026-06-01
 *
 * Target structure (from block library):
 * | Columns |
 * | Text content (eyebrow + heading + paragraph + CTA) | Media content (video/image + stats) |
 *
 * Handles two variations:
 * - Full split: text column + media column (video + stats)
 * - Text-only split: text column + background image (no separate media column)
 */
export default function parse(element, { document }) {
  // --- Text content extraction (present in all instances) ---
  const textCell = [];

  // Eyebrow text (e.g. "who we are", "careers")
  const eyebrowDiv = element.querySelector('[class*="text-eyebrow-default"]');
  if (eyebrowDiv) {
    const eyebrowText = eyebrowDiv.textContent.trim();
    if (eyebrowText) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.innerHTML = '<em>' + eyebrowText + '</em>';
      textCell.push(eyebrowEl);
    }
  }

  // Heading (text-heading-large span)
  const headingSpan = element.querySelector('.text-heading-large');
  if (headingSpan) {
    const h2 = document.createElement('h2');
    h2.textContent = headingSpan.textContent.trim();
    textCell.push(h2);
  }

  // Body text (text-body-large span)
  const bodySpan = element.querySelector('.text-body-large');
  if (bodySpan) {
    const p = document.createElement('p');
    p.textContent = bodySpan.textContent.trim();
    textCell.push(p);
  }

  // CTA button link
  const ctaLink = element.querySelector('a.cmp-button');
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.getAttribute('href') || '';
    link.textContent = ctaLink.textContent.trim();
    textCell.push(link);
  }

  // --- Media content extraction (video + stats, if present) ---
  const mediaCell = [];

  // Video element
  const videoSource = element.querySelector('video source');
  if (videoSource && videoSource.getAttribute('src')) {
    const videoLink = document.createElement('a');
    videoLink.href = videoSource.getAttribute('src');
    videoLink.textContent = videoSource.getAttribute('src');
    mediaCell.push(videoLink);
  }

  // Stats items (text-heading-xlarge values + labels)
  const statsItems = element.querySelectorAll('.text-heading-xlarge');
  statsItems.forEach((statHeading) => {
    const strong = document.createElement('strong');
    strong.textContent = statHeading.textContent.trim();
    mediaCell.push(strong);

    // Find the label - it's typically the next <p> sibling within the same .cmp-text
    const parentCmpText = statHeading.closest('.cmp-text');
    if (parentCmpText) {
      const paragraphs = parentCmpText.querySelectorAll('p');
      for (let i = 0; i < paragraphs.length; i++) {
        if (!paragraphs[i].querySelector('.text-heading-xlarge')) {
          const desc = document.createElement('p');
          desc.textContent = paragraphs[i].textContent.trim();
          if (desc.textContent) {
            mediaCell.push(desc);
          }
        }
      }
    }
  });

  // If no media content found, check for background image on the container
  if (mediaCell.length === 0) {
    const bgStyle = element.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (bgMatch) {
      // Decode CSS escaped path (e.g., \2f with optional space -> /)
      let bgUrl = bgMatch[1].replace(/\\2f\s?/g, '/').replace(/["']/g, '').trim();
      const img = document.createElement('img');
      img.src = bgUrl;
      mediaCell.push(img);
    }
  }

  // Build cells: single row with two columns [text | media]
  const cells = [
    [textCell, mediaCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-split', cells });
  element.replaceWith(block);
}
