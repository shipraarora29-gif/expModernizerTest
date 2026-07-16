/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: medtronic cleanup
 * Removes non-authorable site chrome from Medtronic pages.
 * Covers both templates: product-category-page and homepage.
 * All selectors verified against captured DOM of:
 * - https://www.medtronic.com/en-ca/index.html (homepage)
 * - https://www.medtronic.com/en-ca/healthcare-professionals/products/access-instruments.html (product-category-page)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent banner (found at #onetrust-consent-sdk in captured DOM)
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Skip navigation buttons (found as button.skip-navigation, button.skip-main in captured DOM)
    WebImporter.DOMUtils.remove(element, ['.skip-navigation', '.skip-main']);

    // Warn-on-leave / HCP external link modal (found as .warn-on-leave in captured DOM)
    WebImporter.DOMUtils.remove(element, ['.warn-on-leave']);

    // Hidden contact/sales forms, chatbot screens, and modal dialogs. These are
    // non-authorable interactive widgets rendered hidden in the DOM; when scraped
    // they leak large blocks of form/menu/chatbot text into the imported content.
    // Verified on homepage: 32 .cmp-form/.mdt-form/.contact-us-form-container,
    // 27 [id^="screen"] chatbot steps, and a [role="dialog"].
    WebImporter.DOMUtils.remove(element, [
      'form',
      '.cmp-form',
      '.mdt-form',
      '.contact-us-form-container',
      '.mdt-modal',
      '[role="dialog"]',
      '[id^="screen"]',
      '[id*="contactusForm"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Responsive layout duplicates (homepage only). The source ships mobile/tablet
    // (.no-pad-mobile) copies of "Our Impact" / "Careers" content alongside the
    // desktop layout. Parsers run before this hook and replace their target
    // container with a WebImporter block <table>. So a responsive-duplicate wrapper
    // that contains NO <table> is pure leftover markup safe to delete; a wrapper that
    // DOES contain a <table> holds a parsed block (blocks can be nested inside the
    // mobile copy in this source) and must be kept. Guarding on <table> — not on the
    // block class, which no longer exists post-parse — is what makes this correct.
    const template = payload && payload.template;
    if (template && template.name === 'homepage') {
      element.querySelectorAll('.no-pad-mobile').forEach((wrapper) => {
        if (wrapper.querySelector('table')) return; // holds a parsed block — keep
        wrapper.remove();
      });

      // Remove responsive-duplicate loose content. The source ships hidden mobile
      // copies of "Our Impact" / "Careers" that the scraper flattens into loose
      // <p> siblings, duplicating content already present (either in a parsed block
      // table or as the canonical default-content copy that appears earlier in
      // document order). De-dup globally: walk every loose <p> (not inside a block
      // table) in document order; if a paragraph's normalized text has already been
      // seen, it is the flattened duplicate — remove it. Picture-only paragraphs are
      // keyed by their image alt so repeated GIFs are also collapsed.
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
      // Concatenate all parsed-block-table text and image alts into one haystack.
      // Any loose paragraph whose text/alt is already contained here is a flattened
      // responsive duplicate and is removed.
      let blockHaystack = '';
      const blockAlts = new Set();
      const blockHrefs = new Set();
      element.querySelectorAll('table').forEach((table) => {
        blockHaystack += ` ${norm(table.textContent)} `;
        table.querySelectorAll('img').forEach((img) => {
          const v = norm(img.getAttribute('alt'));
          if (v) blockAlts.add(v);
        });
        table.querySelectorAll('a[href]').forEach((a) => {
          blockHrefs.add(a.getAttribute('href'));
        });
      });
      // Also track loose content already kept, so repeated loose-only lines collapse.
      const looseSeen = new Set();
      element.querySelectorAll('p').forEach((p) => {
        if (p.closest('table')) return; // inside a parsed block — keep
        const img = p.querySelector('img');
        if (img) {
          const alt = norm(img.getAttribute('alt'));
          // drop impact GIFs already shown in a block; collapse repeated alts.
          // "TBD"/empty alts are the flattened-copy orphan images — drop repeats.
          const altKey = `img:${alt}`;
          if (blockAlts.has(alt) || looseSeen.has(altKey)) { p.remove(); return; }
          looseSeen.add(altKey);
          return;
        }
        const link = p.querySelector('a[href]');
        if (link) {
          const href = link.getAttribute('href');
          const hrefKey = `href:${href}`;
          if (blockHrefs.has(href) || looseSeen.has(hrefKey)) { p.remove(); return; }
          looseSeen.add(hrefKey);
        }
        const t = norm(p.textContent);
        if (!t) return;
        if (blockHaystack.includes(t) || looseSeen.has(`txt:${t}`)) {
          p.remove();
        } else {
          looseSeen.add(`txt:${t}`);
        }
      });
    }

    // Header container (found as .com-header-container in captured DOM - contains logo, nav, search, language selector)
    WebImporter.DOMUtils.remove(element, ['.com-header-container']);

    // Breadcrumb section (found as .mdt-header-breadcrumb in captured DOM)
    WebImporter.DOMUtils.remove(element, ['.mdt-header-breadcrumb']);

    // Footer element (found as <footer> in captured DOM)
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Social share widget (found as .share in captured DOM - contains share/print/mail/facebook/linkedin icons)
    WebImporter.DOMUtils.remove(element, ['.share']);

    // Iframes (tracking pixels like Adobe Audience Manager)
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Noscript and link elements (non-authorable)
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
