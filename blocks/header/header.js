// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment HTML. Tries localhost/aem-up path first,
 * then the block-metadata path for DA/EDS production.
 * @param {string} navPath path to the nav doc without the .plain.html suffix
 * @returns {Document|null} parsed fragment document
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Close all open desktop dropdown panels.
 * @param {Element} nav
 */
function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-item[aria-expanded="true"], .nav-has-flyout[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Build a flyout row inside a panel. Rows whose source <li> has a nested <ul>
 * get a chevron and their own nested flyout panel (recursive), matching the
 * source's narrow single-column multi-level menu.
 * @param {HTMLLIElement} li source list item
 * @returns {HTMLLIElement} decorated flyout row
 */
function buildFlyoutRow(li) {
  const row = document.createElement('li');
  row.className = 'nav-flyout-row';

  const link = li.querySelector(':scope > a');
  const childList = li.querySelector(':scope > ul');
  const label = link ? link.textContent.trim() : li.textContent.trim();
  const href = link ? link.getAttribute('href') : '#';

  const a = document.createElement('a');
  a.className = 'nav-flyout-link';
  a.href = href;
  a.textContent = label;
  row.append(a);

  if (childList) {
    row.classList.add('nav-has-flyout');
    row.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('ul');
    panel.className = 'nav-flyout';
    [...childList.children]
      .filter((c) => c.tagName === 'LI')
      .forEach((childLi) => panel.append(buildFlyoutRow(childLi)));
    row.append(panel);
  }
  return row;
}

/**
 * Build a top-level nav item (and its first-level dropdown) from a source <li>.
 * @param {HTMLLIElement} li source list item
 * @returns {HTMLLIElement} decorated nav item
 */
function buildNavItem(li) {
  const item = document.createElement('li');
  item.className = 'nav-item';

  const link = li.querySelector(':scope > a');
  const childList = li.querySelector(':scope > ul');
  const label = link ? link.textContent.trim() : li.textContent.trim();
  const href = link ? link.getAttribute('href') : '#';

  const trigger = document.createElement('a');
  trigger.className = 'nav-item-trigger';
  trigger.href = href;
  trigger.textContent = label;
  item.append(trigger);

  if (childList) {
    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('ul');
    panel.className = 'nav-panel nav-flyout';
    [...childList.children]
      .filter((c) => c.tagName === 'LI')
      .forEach((childLi) => panel.append(buildFlyoutRow(childLi)));
    item.append(panel);
  }
  return item;
}

/**
 * Build the search form for the utility row.
 * @returns {HTMLFormElement}
 */
function buildSearch() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.action = '/en-ca/search.html';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search Medtronic';
  input.setAttribute('aria-label', 'Search Medtronic');
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'nav-search-submit';
  button.setAttribute('aria-label', 'Search Medtronic');
  button.innerHTML = '<span class="nav-search-icon" aria-hidden="true"></span>';
  form.append(input, button);
  return form;
}

/**
 * Build the language/region locale selector for the utility row.
 * @returns {HTMLDivElement}
 */
function buildLocale() {
  const wrap = document.createElement('div');
  wrap.className = 'nav-locale';
  wrap.innerHTML = `
    <button type="button" class="nav-locale-lang" aria-haspopup="true" aria-expanded="false">English</button>
    <button type="button" class="nav-locale-region" aria-haspopup="true" aria-expanded="false">
      <span class="nav-locale-globe" aria-hidden="true"></span>Canada - English
    </button>`;
  wrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
  return wrap;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navPath = '/content/nav';
  const fragment = await fetchNav(navPath);
  block.textContent = '';
  if (!fragment) return;

  const sections = fragment.body.querySelectorAll(':scope > div');
  const brandSection = sections[0];
  const navSection = sections[1];
  const toolsSection = sections[2];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // --- Utility row: hamburger + logo + search + locale ---
  const utilityRow = document.createElement('div');
  utilityRow.className = 'nav-utility';

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';

  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  const brandLink = brandSection ? brandSection.querySelector('a') : null;
  brand.href = brandLink ? brandLink.getAttribute('href') : '/content/en-ca';
  brand.setAttribute('aria-label', 'Medtronic home');
  brand.innerHTML = '<span class="nav-brand-logo">Medtronic</span>';

  utilityRow.append(hamburger, brand, buildSearch(), buildLocale());

  // --- Main nav row: megamenu items + Contact & Support ---
  const navRow = document.createElement('div');
  navRow.className = 'nav-main';
  const navList = document.createElement('ul');
  navList.className = 'nav-list';
  const sourceItems = navSection ? navSection.querySelectorAll(':scope > ul > li') : [];
  sourceItems.forEach((li) => navList.append(buildNavItem(li)));
  navRow.append(navList);

  // tools (Contact & Support)
  if (toolsSection) {
    const tools = document.createElement('ul');
    tools.className = 'nav-tools';
    toolsSection.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      li.append(link);
      tools.append(li);
    });
    navRow.append(tools);
  }

  nav.append(utilityRow, navRow);

  // --- Desktop hover + click behavior for top-level dropdowns ---
  navList.querySelectorAll(':scope > .nav-drop').forEach((item) => {
    const trigger = item.querySelector('.nav-item-trigger');
    trigger.addEventListener('click', (e) => {
      if (trigger.getAttribute('href') === '#') e.preventDefault();
      const open = item.getAttribute('aria-expanded') === 'true';
      closeAllPanels(nav);
      item.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    item.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        closeAllPanels(nav);
        item.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        item.setAttribute('aria-expanded', 'false');
        item.querySelectorAll('.nav-has-flyout[aria-expanded="true"]').forEach((r) => {
          r.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  // --- Nested flyout rows (open sideways on hover; toggle on click for mobile) ---
  navList.querySelectorAll('.nav-has-flyout').forEach((rowEl) => {
    const rowLink = rowEl.querySelector(':scope > .nav-flyout-link');
    rowEl.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        const siblings = rowEl.parentElement.querySelectorAll(':scope > .nav-has-flyout[aria-expanded="true"]');
        siblings.forEach((s) => { if (s !== rowEl) s.setAttribute('aria-expanded', 'false'); });
        rowEl.setAttribute('aria-expanded', 'true');
      }
    });
    rowEl.addEventListener('mouseleave', () => {
      if (isDesktop.matches) rowEl.setAttribute('aria-expanded', 'false');
    });
    rowLink.addEventListener('click', (e) => {
      if (rowLink.getAttribute('href') === '#') e.preventDefault();
      if (!isDesktop.matches) {
        const open = rowEl.getAttribute('aria-expanded') === 'true';
        rowEl.setAttribute('aria-expanded', open ? 'false' : 'true');
      }
    });
  });

  // close panels on outside click / escape
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllPanels(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllPanels(nav);
  });

  // hamburger toggles mobile menu
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = expanded ? '' : 'hidden';
  });

  // reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    nav.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
