# Whale Extension Vite Template

A modern Naver Whale extension boilerplate built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Project Structure

```
├── public/
│   └── manifest.json          # Whale extension manifest (v3)
├── src/
│   ├── popup/                 # Extension popup UI
│   │   ├── Popup.tsx
│   │   └── index.tsx
│   ├── sidebar/               # Whale sidebar UI (Whale-specific)
│   │   ├── Sidebar.tsx
│   │   └── index.tsx
│   ├── options/               # Extension options page
│   │   ├── Options.tsx
│   │   └── index.tsx
│   ├── background/            # Background service worker
│   │   └── index.ts
│   ├── content/               # Content script
│   │   └── index.ts
│   └── index.css             # Global styles with Tailwind
├── popup.html                # Popup HTML entry point
├── sidebar.html              # Sidebar HTML entry point (Whale-specific)
├── options.html              # Options page HTML entry point
└── vite.config.ts            # Vite configuration for multi-page build
```

## Features

- **Manifest V3**: Latest extension manifest version
- **Whale Sidebar**: Built-in sidebar support (Whale-specific feature)
- **Chrome Compatible**: Works with both Whale and Chrome browsers
- **React 18**: Modern React with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible component library
- **Vite**: Fast build tool and dev server
- **TypeScript**: Full type safety with Whale & Chrome types
- **Hot Module Replacement**: Fast development experience

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

The extension will be built to the `dist/` folder.

### Load Extension in Whale Browser

1. Run `npm run build` to create the production build
2. Open Whale browser and go to `whale://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked extension"
5. Select the `dist/` folder

### Load Extension in Chrome (also compatible)

1. Run `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

## Extension Components

### Popup (`src/popup/`)

The UI that appears when users click the extension icon in the toolbar.

### Sidebar (`src/sidebar/`) - Whale-specific

The sidebar UI unique to Whale browser. Provides a persistent side panel for your extension.

Features:
- Always accessible alongside web pages
- Can display current page URL
- Quick actions integration
- Navigation bar support

### Options Page (`src/options/`)

A full-page interface for extension settings. Access via right-click on extension icon → Options.

### Background Service Worker (`src/background/`)

Runs in the background and handles events like:
- Extension installation
- Messages from content scripts
- Tab updates
- Browser events

### Content Script (`src/content/`)

Runs in the context of web pages and can:
- Access and modify the DOM
- Communicate with the background script
- Inject UI elements into pages

## Whale/Chrome Storage API

The extension uses `whale.storage.sync` (or `chrome.storage.sync`) for settings persistence. Example usage can be found in `src/options/Options.tsx`.

## Communication Between Components

- **Popup ↔ Background**: Use `whale.runtime.sendMessage()`
- **Sidebar ↔ Background**: Use `whale.runtime.sendMessage()`
- **Content ↔ Background**: Use `whale.runtime.sendMessage()`
- **Background → Content**: Use `whale.tabs.sendMessage()`

Note: `whale.*` APIs are compatible with `chrome.*` APIs.

## Customization

### Adding Icons

Add icon files to the `public/` folder:
- `icon-16.png` (16x16px)
- `icon-48.png` (48x48px)
- `icon-128.png` (128x128px)

### Permissions

Edit `public/manifest.json` to add required permissions:

```json
{
  "permissions": [
    "storage",
    "activeTab",
    "tabs"
  ],
  "host_permissions": [
    "https://*.example.com/*"
  ]
}
```

### shadcn/ui Components

Add shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## Whale-Specific Features

### Sidebar Action

The sidebar is a unique Whale browser feature that provides a persistent side panel. Configured in `manifest.json`:

```json
"sidebar_action": {
  "default_page": "sidebar.html",
  "default_icon": { "16": "icon-16.png" },
  "default_title": "Whale Sidebar",
  "use_navigation_bar": true
}
```

### Whale Web APIs

- **window.open extensions**: `whale-sidebar`, `whale-space`, `whale-mobile`, `web-app`
- **BarcodeDetector API**: Built-in barcode recognition
- **Media Session API**: Integration with global media controls

## Resources

- [Naver Whale Extension Docs](https://developers.whale.naver.com/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/) (Compatible)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/to-service-workers/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
