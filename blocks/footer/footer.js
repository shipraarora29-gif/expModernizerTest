/**
 * Fetch the footer fragment HTML. Tries localhost/aem-up path first,
 * then the block-metadata path for DA/EDS production.
 * @param {string} footerPath path to the footer doc without the .plain.html suffix
 * @returns {Document|null} parsed fragment document
 */
async function fetchFooter(footerPath) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter('/content/footer');
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  const sections = fragment.body.querySelectorAll(':scope > div');
  const [linksSection, brandSection, addressSection] = sections;

  if (linksSection) {
    const top = document.createElement('div');
    top.className = 'footer-links';
    while (linksSection.firstElementChild) top.append(linksSection.firstElementChild);
    footer.append(top);
  }

  if (brandSection) {
    const mid = document.createElement('div');
    mid.className = 'footer-brand';

    // left: logo wordmark + tagline
    const brandCol = document.createElement('div');
    brandCol.className = 'footer-brand-name';
    const paras = brandSection.querySelectorAll(':scope > p');
    if (paras[0]) { paras[0].classList.add('footer-logo'); brandCol.append(paras[0]); }
    if (paras[1]) { paras[1].classList.add('footer-tagline'); brandCol.append(paras[1]); }
    mid.append(brandCol);

    // center: legal links
    const lists = brandSection.querySelectorAll(':scope > ul');
    if (lists[0]) { lists[0].classList.add('footer-legal'); mid.append(lists[0]); }

    // right: social
    if (lists[1]) { lists[1].classList.add('footer-social'); mid.append(lists[1]); }

    footer.append(mid);
  }

  if (addressSection) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-address';
    while (addressSection.firstElementChild) bottom.append(addressSection.firstElementChild);
    footer.append(bottom);
  }

  block.append(footer);
}
