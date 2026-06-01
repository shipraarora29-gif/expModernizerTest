/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import columnsSplitParser from './parsers/columns-split.js';
import cardsStatsParser from './parsers/cards-stats.js';

// TRANSFORMER IMPORTS
import medtronicCleanupTransformer from './transformers/medtronic-cleanup.js';
import medtronicSectionsTransformer from './transformers/medtronic-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Medtronic Canada homepage with hero, featured content sections, and promotional cards',
  urls: [
    'https://www.medtronic.com/en-ca/index.html'
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.herobanner']
    },
    {
      name: 'cards-teaser',
      instances: ['.cmp-teaser']
    },
    {
      name: 'columns-split',
      instances: ['#container-da1dd1a5b3', '#container-3d3f1fa609']
    },
    {
      name: 'cards-stats',
      instances: ['#container-d0b51fad6e']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.hero-main-content',
      style: null,
      blocks: ['hero-homepage'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Teasers Section',
      selector: '#container-f85633ca34',
      style: null,
      blocks: ['cards-teaser'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Who We Are Section',
      selector: '#container-da1dd1a5b3',
      style: 'dark',
      blocks: ['columns-split'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Health Equity Section',
      selector: '#container-eb3e077ff0',
      style: 'dark',
      blocks: [],
      defaultContent: ['#text-0054474e68', '#text-7be0c0b242']
    },
    {
      id: 'section-5',
      name: 'Our Impact Section',
      selector: '#container-c5b1b5c864',
      style: 'highlight',
      blocks: ['cards-stats', 'cards-teaser'],
      defaultContent: ['#text-8465c5165e', '#text-9e775b359d', '#text-85cc638863']
    },
    {
      id: 'section-6',
      name: 'Careers Section',
      selector: '#container-3d3f1fa609',
      style: 'dark',
      blocks: ['columns-split'],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-teaser': cardsTeaserParser,
  'columns-split': columnsSplitParser,
  'cards-stats': cardsStatsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  medtronicCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [medtronicSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '/')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
