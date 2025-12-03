# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Naver Whale browser extension template built with Vite, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. It uses Manifest V3 and includes Whale-specific features like the sidebar action.

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # Type-check and build for production to dist/
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

### Loading Extension in Whale Browser
1. Run `npm run build` to create production build in `dist/`
2. Open `whale://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked extension" and select the `dist/` folder

## Architecture

### Multi-Page Vite Build System

The project uses Vite's multi-page build configuration (vite.config.ts:16-22) with 5 entry points:

1. **popup.html** → Toolbar popup UI (React)
2. **sidebar.html** → Whale sidebar UI (React, Whale-specific feature)
3. **options.html** → Extension options page (React)
4. **src/background/index.ts** → Background service worker (plain TS)
5. **src/content/index.ts** → Content script (plain TS)

Critical build configuration details (vite.config.ts:24-38):
- Background and content scripts must be output as `.js` files at dist root (not in assets/)
- HTML pages and their chunks go to `assets/` with hashing
- Static assets like `vite.svg` stay at root without hashing for manifest.json references

### Extension Component Communication

All components use the `whale.*` API (compatible with `chrome.*`):

- **Background ↔ Popup/Sidebar/Options**: Use `whale.runtime.sendMessage()` with `whale.runtime.onMessage.addListener()`
- **Background → Content Script**: Use `whale.tabs.sendMessage(tabId, message)`
- **Content Script → Background**: Use `whale.runtime.sendMessage()`

Key pattern in background/content scripts (see src/background/index.ts:15-24 and src/content/index.ts:11-19):
- Always `return true` in message listeners to keep channel open for async responses
- Use `sendResponse()` callback for replies

### TypeScript Configuration

Three-tier tsconfig setup:
- **tsconfig.json**: Root config with path aliases (`@/*` → `./src/*`)
- **tsconfig.app.json**: For application code (React components)
- **tsconfig.node.json**: For Vite config files

Path alias `@/*` is configured in both vite.config.ts:10-12 and tsconfig.json:8-11.

### React & UI Architecture

- **React 19** with TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** components in `src/components/ui/`
- Components use `cn()` utility from `src/lib/utils.ts` for className merging

To add shadcn components: `npx shadcn@latest add [component-name]`

### Whale-Specific Features

#### Sidebar Action (Whale-Only Feature)
Configured in manifest.json:19-26. The sidebar is a persistent side panel unique to Whale browser.

Key sidebar settings:
- `default_page`: sidebar.html entry point
- `use_navigation_bar: true`: Shows back/forward navigation in sidebar
- Access current tab URL via `whale.tabs.query()` in sidebar context

See whale-extension-dev-guide-mv3.md for complete `whale.sidebarAction` API documentation (show/hide/dock/undock methods).

#### API Compatibility
- Whale browser supports both `whale.*` and `chrome.*` APIs interchangeably
- All Chrome extension APIs work in Whale
- Use `whale.*` for clarity when working in this codebase

### Manifest V3 Architecture

Key MV3 requirements enforced in this template:

1. **Service Worker Background**: `manifest.json` uses `background.service_worker` with `type: "module"` (manifest.json:27-30)
2. **No Remote Code**: All scripts must be bundled locally
3. **Host Permissions Separated**: `host_permissions` array separate from `permissions` (manifest.json:42-47)
4. **No Blocking WebRequest**: Use declarativeNetRequest for request blocking (not implemented in template)

### Storage Patterns

Example storage initialization in src/background/index.ts:7-12:
```typescript
whale.storage.sync.set({
  settings: {
    option1: true,
    option2: false,
  }
});
```

Use `whale.storage.sync` for user settings (syncs across devices) or `whale.storage.local` for local-only data.

## Important Implementation Notes

### When Modifying Build Configuration

If adding new entry points or changing output structure:
1. Update `build.rollupOptions.input` in vite.config.ts
2. Ensure scripts referenced in manifest.json match output file paths
3. Background/content scripts MUST output to dist root as `.js` files (see vite.config.ts:26-28)

### When Adding Extension Permissions

Edit public/manifest.json:
- `permissions[]`: For extension APIs like "storage", "tabs"
- `host_permissions[]`: For accessing web URLs
- Always check if permission is required before adding

### When Working with Content Scripts

Content scripts run in webpage context:
- Can access/modify DOM
- Cannot use most extension APIs (except runtime messaging)
- Isolated from page JavaScript by default
- Currently matches `<all_urls>` (manifest.json:32-39) - restrict if needed

### When Working with Background Service Worker

Service workers have limitations:
- No DOM access (no `window`, `document`)
- Persistent timers not reliable - use `whale.alarms` API instead
- Can become inactive - store state in `whale.storage` not in-memory variables
- ES modules supported via `type: "module"` in manifest

## Development References

- Whale Extension Dev Guide: whale-extension-dev-guide-mv3.md (Korean, detailed API specs)
- README.md: User-facing setup and structure documentation
- TypeScript types: `@types/naver-whale` for Whale APIs, `@types/chrome` for Chrome APIs
