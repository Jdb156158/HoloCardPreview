---
name: holo-card-preview
description: Create or extend a local holographic card preview website with user image upload, editable card text, 24 foil finishes, and shared desktop and iPhone-shell layouts. Use for interactive card demos, not AI segmentation or real 3D reconstruction.
---

# Holo Card Preview

Use the bundled static website to produce a working, editable card preview. No API key, image-generation service, build step, or framework is required.

## Create a preview

1. Copy the template into a new output directory with `python3 scripts/create_preview.py --output /absolute/new-directory` (resolve the script relative to this skill directory). It refuses an existing destination to avoid overwriting user work.
2. Serve the generated directory with `python3 -m http.server 4173 --bind 127.0.0.1 --directory /absolute/new-directory`. Keep the server process running while the user previews.
3. Open `http://127.0.0.1:4173/studio.html` for desktop and `http://127.0.0.1:4173/mobile.html` for the iPhone shell. Verify actual browser rendering. If the port is occupied, select another port rather than stopping unrelated processes.
4. Test image upload, text visibility/editing, finish selection and click-to-flip. Give the user both URLs and the output location. Localhost is accessible only on the machine running the server; do not describe it as a public phone link.

## Extend an existing preview

Read [architecture.md](references/architecture.md) before editing. Modify the existing output rather than recopying the starter over it.

- Keep `studio.js` as the shared logic for image input, labels, finishes and gestures. The mobile shell embeds `studio.html?phone=1`; `phone.js` moves the same controls into a bottom sheet.
- Implement new behavior once and expose it in both layouts. New settings need a corresponding `panelMap` placement in `phone.js`. Verify both URLs after changes.
- Preserve the user's uploaded image when inspecting: use a separate test tab where practical. Reloading clears image and text changes.
- Changing the image must not hide labels. Visibility is controlled by the explicit text switch. Set user text with `textContent`, not HTML.
- Keep foil confined to the front card face and below captions. Strength zero must suppress light overlays; the decorative rim remains.
- Preserve pointer drag vs tap distinction, pointer cancellation, keyboard interaction, reduced-motion behavior, native file selection and dialog dismissal.

## Boundaries and delivery

This is a single-image CSS/SVG foil simulation, not the upstream four-layer AI workflow. It has no automatic cutout, hidden-background repair, depth slider, contour extraction, device orientation or native iOS haptics. The iPhone frame is a web mockup; browser verification does not establish real-device compatibility.

Uploaded images stay in browser memory as object URLs. There is no upload API, persistence, cross-tab synchronization or export. The default illustration is AI-generated; replace it only when requested. Publishing the template is separate from publishing private user artwork: use only assets authorized for that destination.

Keep public deployment relative-path compatible. GitHub Pages setup is documented in the repository README; do not promise a live URL before verifying a successful response.
