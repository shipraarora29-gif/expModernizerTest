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
  }

  if (hookName === TransformHook.afterTransform) {
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
