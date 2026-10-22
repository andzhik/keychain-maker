# Keychain Maker

Turn your logo into a multi-color, 3D-printable keychain in your browser.
Upload an SVG, PNG, JPEG, or WebP and export a `.3mf` for your slicer.

![Logo to 3D keychain to slicer preview](docs/img/logo-steps.png)

[Open the app](https://andzhik.github.io/keychain-maker/)

![Keychain Maker interface](docs/img/UI.png)

## Make a keychain

1. Upload your logo. Simple artwork with solid colors works best.
2. Choose a square or circle base, adjust the size and colors, and check the preview.
3. Download the `.3mf` and open it in your slicer.

For SVGs, convert text and strokes to filled paths first.
Need artwork? Try the [example gallery](docs/examples.md).

## Run locally

With Bun installed:

```bash
bun install
bun run dev
```

Open the local URL printed by Vite.
Use `bun run test` for unit tests and `bun run build` for a production build.

## More

- [User guide](docs/user-guide.md): controls, supported artwork, and limits.
- [Development](docs/development.md): scripts, testing, and project structure.
- [All documentation](docs/README.md): examples, design notes, deployment, and roadmap.
