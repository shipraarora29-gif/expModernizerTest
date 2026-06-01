/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const heroImage = element.querySelector('.hero-image img, img[class*="hero"], img');
    const preTitle = element.querySelector('.pre-title, [class*="pre-title"], [class*="eyebrow"]');
    const heading = element.querySelector('h1.title, h1, h2.title, h2, [class*="title"]:not(.pre-title)');
    const description = element.querySelector(".description p, .description, p:not(.pre-title):not(.title)");
    const ctaLinks = Array.from(element.querySelectorAll(".action-link a.cmp-button, .button a.cmp-button, .action-link a, a.cmp-button, a.button"));
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentContainer = document.createElement("div");
    if (preTitle) {
      contentContainer.appendChild(preTitle);
    }
    if (heading) {
      contentContainer.appendChild(heading);
    }
    if (description) {
      contentContainer.appendChild(description);
    }
    ctaLinks.forEach((link) => {
      contentContainer.appendChild(link);
    });
    if (contentContainer.childNodes.length > 0) {
      cells.push([contentContainer]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const pretitle = element.querySelector('.cmp-teaser__pretitle, p[class*="pretitle"]');
    const titleLink = element.querySelector(".cmp-teaser__title-link, .cmp-teaser__title a");
    const titleHeading = element.querySelector("h2.cmp-teaser__title, h2, h3");
    const description = element.querySelector(".cmp-teaser__description p, .cmp-teaser__description");
    const contentCell = [];
    if (pretitle) {
      contentCell.push(pretitle);
    }
    if (titleHeading) {
      contentCell.push(titleHeading);
    }
    if (description) {
      contentCell.push(description);
    }
    const cells = [];
    const imageCell = image ? [image] : [];
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-split.js
  function parse3(element, { document }) {
    const textCell = [];
    const eyebrowDiv = element.querySelector('[class*="text-eyebrow-default"]');
    if (eyebrowDiv) {
      const eyebrowText = eyebrowDiv.textContent.trim();
      if (eyebrowText) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.innerHTML = "<em>" + eyebrowText + "</em>";
        textCell.push(eyebrowEl);
      }
    }
    const headingSpan = element.querySelector(".text-heading-large");
    if (headingSpan) {
      const h2 = document.createElement("h2");
      h2.textContent = headingSpan.textContent.trim();
      textCell.push(h2);
    }
    const bodySpan = element.querySelector(".text-body-large");
    if (bodySpan) {
      const p = document.createElement("p");
      p.textContent = bodySpan.textContent.trim();
      textCell.push(p);
    }
    const ctaLink = element.querySelector("a.cmp-button");
    if (ctaLink) {
      const link = document.createElement("a");
      link.href = ctaLink.getAttribute("href") || "";
      link.textContent = ctaLink.textContent.trim();
      textCell.push(link);
    }
    const mediaCell = [];
    const videoSource = element.querySelector("video source");
    if (videoSource && videoSource.getAttribute("src")) {
      const videoLink = document.createElement("a");
      videoLink.href = videoSource.getAttribute("src");
      videoLink.textContent = videoSource.getAttribute("src");
      mediaCell.push(videoLink);
    }
    const statsItems = element.querySelectorAll(".text-heading-xlarge");
    statsItems.forEach((statHeading) => {
      const strong = document.createElement("strong");
      strong.textContent = statHeading.textContent.trim();
      mediaCell.push(strong);
      const parentCmpText = statHeading.closest(".cmp-text");
      if (parentCmpText) {
        const paragraphs = parentCmpText.querySelectorAll("p");
        for (let i = 0; i < paragraphs.length; i++) {
          if (!paragraphs[i].querySelector(".text-heading-xlarge")) {
            const desc = document.createElement("p");
            desc.textContent = paragraphs[i].textContent.trim();
            if (desc.textContent) {
              mediaCell.push(desc);
            }
          }
        }
      }
    });
    if (mediaCell.length === 0) {
      const bgStyle = element.getAttribute("style") || "";
      const bgMatch = bgStyle.match(/background-image\s*:\s*url\(([^)]+)\)/);
      if (bgMatch) {
        let bgUrl = bgMatch[1].replace(/\\2f\s?/g, "/").replace(/["']/g, "").trim();
        const img = document.createElement("img");
        img.src = bgUrl;
        mediaCell.push(img);
      }
    }
    const cells = [
      [textCell, mediaCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse4(element, { document }) {
    const statCards = element.querySelectorAll(".container.responsivegrid.pad-left");
    const cells = [];
    statCards.forEach((card) => {
      const image = card.querySelector("img");
      const statNumberEl = card.querySelector(".text-heading-xlarge");
      const statFallback = card.querySelector(".text-color-link p");
      const descriptionEl = card.querySelector(".text:not(.text-color-link) .text-body-large");
      const descFallback = card.querySelector(".text:not(.text-color-link) p");
      const statText = statNumberEl ? statNumberEl.textContent.trim() : statFallback ? statFallback.textContent.trim() : "";
      const descText = descriptionEl ? descriptionEl.textContent.trim() : descFallback ? descFallback.textContent.trim() : "";
      if (!statText && !image) return;
      const contentCell = [];
      if (statText) {
        const strong = document.createElement("strong");
        strong.textContent = statText;
        contentCell.push(strong);
      }
      if (descText) {
        const br = document.createElement("br");
        contentCell.push(br);
        const desc = document.createTextNode(descText);
        contentCell.push(desc);
      }
      if (image) {
        cells.push([image, contentCell]);
      } else {
        cells.push([contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/medtronic-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, [".skip-navigation", ".skip-main"]);
      WebImporter.DOMUtils.remove(element, [".warn-on-leave"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".com-header-container"]);
      WebImporter.DOMUtils.remove(element, [".mdt-header-breadcrumb"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, [".share"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/medtronic-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Medtronic Canada homepage with hero, featured content sections, and promotional cards",
    urls: [
      "https://www.medtronic.com/en-ca/index.html"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".herobanner"]
      },
      {
        name: "cards-teaser",
        instances: [".cmp-teaser"]
      },
      {
        name: "columns-split",
        instances: ["#container-da1dd1a5b3", "#container-3d3f1fa609"]
      },
      {
        name: "cards-stats",
        instances: ["#container-d0b51fad6e"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".hero-main-content",
        style: null,
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Teasers Section",
        selector: "#container-f85633ca34",
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Who We Are Section",
        selector: "#container-da1dd1a5b3",
        style: "dark",
        blocks: ["columns-split"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Health Equity Section",
        selector: "#container-eb3e077ff0",
        style: "dark",
        blocks: [],
        defaultContent: ["#text-0054474e68", "#text-7be0c0b242"]
      },
      {
        id: "section-5",
        name: "Our Impact Section",
        selector: "#container-c5b1b5c864",
        style: "highlight",
        blocks: ["cards-stats", "cards-teaser"],
        defaultContent: ["#text-8465c5165e", "#text-9e775b359d", "#text-85cc638863"]
      },
      {
        id: "section-6",
        name: "Careers Section",
        selector: "#container-3d3f1fa609",
        style: "dark",
        blocks: ["columns-split"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-homepage": parse,
    "cards-teaser": parse2,
    "columns-split": parse3,
    "cards-stats": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").replace(/\/index$/, "/")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
