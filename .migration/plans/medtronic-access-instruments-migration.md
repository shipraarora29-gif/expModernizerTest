Let me examine the current project structure to understand what's already in place.# Page Migration Plan: Medtronic Access & Instruments

## Source Page
- **URL:** https://www.medtronic.com/en-ca/healthcare-professionals/products/access-instruments.html
- **Type:** Product category listing page (Healthcare Professionals — Access & Instruments)

## Target Project
- **Repo:** shipraarora29-gif/expModernizerTest
- **Type:** AEM Edge Delivery Services (doc-based)
- **Existing Blocks:** hero, columns, cards, header, footer, fragment

## Migration Steps

### Phase 1: Page Analysis
Analyze the source page to identify sections, blocks, content structure, and authoring patterns. This will produce:
- Cleaned HTML
- Page structure JSON (sections, blocks, metadata)
- Screenshots for visual reference
- Block variant identification

### Phase 2: Block Mapping & Infrastructure
Based on the analysis:
- Map source page components to EDS blocks (existing or new)
- Identify any new block variants needed (e.g., product cards, category tiles, filters)
- Create page template definition
- Generate block parsers and page transformers for import

### Phase 3: Block Development (if needed)
For any blocks not already present in the project:
- Create block JS/CSS following EDS conventions
- Style to match the source page design
- Ensure responsive behavior and accessibility

### Phase 4: Content Import
- Generate the import script combining template + parsers + transformers
- Execute the import to produce EDS-compatible HTML content
- Verify the imported content renders correctly in the local dev server

### Phase 5: Design & Visual QA
- Extract and apply design tokens (colors, fonts, spacing) from the source
- Style blocks to visually match the original page
- Perform visual comparison and iterate on CSS fixes

## Checklist

- [ ] Analyze source page structure (sections, blocks, metadata)
- [ ] Identify block variants and map to EDS blocks
- [ ] Create page template definition
- [ ] Develop any new blocks required (JS/CSS)
- [ ] Generate import infrastructure (parsers, transformers)
- [ ] Execute content import
- [ ] Verify content renders in local preview
- [ ] Apply site/block design styling
- [ ] Perform visual QA comparison against source
- [ ] Run linting and fix any issues
- [ ] Confirm final page in local dev server

## Notes
- This is a fresh project with boilerplate blocks only — new blocks will likely be needed for product listings/cards
- The `excat:excat-site-migration` skill will orchestrate most of this workflow
- Execution requires switching out of Plan mode
