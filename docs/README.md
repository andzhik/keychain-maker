# Documentation

- [Main README](../README.md): what the app does and how to get started.
- [User guide](user-guide.md): controls, artwork preparation, import limits,
  and printability warnings.
- [Curated SVG examples](examples.md): downloadable artwork, recommended settings,
  screenshots, and manual regression checks.
- [Development](development.md): setup, scripts, test fixtures, render snapshots,
  latency measurement, and project structure.
- [Design Decisions & Gotchas](design-decisions.md): geometry, refinement,
  rebuild, and rendering constraints.
- [Deployment](deployment.md): production and preview deployments on GitHub Pages.
- [Surface inlay validation](surface-inlays.md): slicer comparisons and geometry checks.
- [Improvement roadmap](IMPROVEMENT-ROADMAP.md): open development gaps and planned CI work.

Before changing geometry, rebuild timing, or rendering, read
[Design Decisions & Gotchas](design-decisions.md).

`img/` contains the screenshots used by these docs and the main README. The
interface screenshot uses [the orbital badge](../examples/complex-logo.svg)
with the app's default settings; the gallery documents its render settings and
reproduction commands.
