# Walkthrough - Portfolio Refactor

I have refactored the portfolio from a monolithic `index.html` into a modular structure.

## Changes

### 1. Created Directory Structure
- Added `css/` for styles.
- Added `js/` for logic.

### 2. Extracted CSS
- Moved ~400 lines of custom CSS and animations into `css/style.css`.
- Linked it in `<head>` of `index.html`.

### 3. Extracted JavaScript
- Moved ~300 lines of interactive logic (Story Intro, Typewriter, Contact Form, Scroll Reveal) into `js/main.js`.
- Linked it at the end of `<body>` in `index.html`.
- Exported `handleContactSubmit` to `window` to maintain compatibility with the `onsubmit` attribute in HTML.

### 4. Simplified `index.html`
- Removed all large `<style>` and `<script>` blocks.
- The file is now focused on content and structure, making it much easier to maintain.
