# marianni iOS

Native SwiftUI app for marianni's access-to-luxury platform (rental, lease,
subscription, AR try-on). Sibling to the Next.js web app at the repo root —
they share brand language but do not share code.

## Quick start (under 5 minutes)

```bash
# From the repo root:
cd ios

# One-time: install XcodeGen if you don't have it.
brew install xcodegen

# Generate the Xcode project from project.yml.
xcodegen generate

# Open in Xcode.
open Marianni.xcodeproj
```

In Xcode: pick the **Marianni** scheme and an iPhone 15 (or any iOS 17+)
simulator, then **⌘R**.

To run the unit tests: **⌘U**, or from the command line:

```bash
xcodebuild \
  -project Marianni.xcodeproj \
  -scheme Marianni \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  test
```

## Repo layout

```
ios/
├── project.yml                 # XcodeGen spec — source of truth
├── .swiftlint.yml              # Lint rules
├── Marianni/
│   ├── App/                    # @main entry, Info.plist
│   ├── Features/               # Feature modules (Home, …)
│   ├── DesignSystem/
│   │   ├── Tokens/             # Colors, Spacing, Radius, Motion, Typography
│   │   └── Fonts/              # TODO: drop real Cormorant + Lato .ttf here
│   ├── Networking/             # Client protocol + MockClient
│   ├── Persistence/            # Storage protocol + UserDefaults / In-memory
│   └── Resources/
│       ├── Assets.xcassets/
│       ├── Localized/
│       │   ├── de.lproj/
│       │   └── en.lproj/
│       └── L10n.swift
└── Tests/
    ├── Unit/                   # XCTest
    └── Snapshot/               # Placeholder — see Tests/Snapshot/README.md
```

## Targets & versions

- **Bundle id:** `com.marianni.app`
- **Min iOS:** 17.0 (per CTO default; revisit when usage data lands)
- **Swift:** 5.9+
- **UI:** SwiftUI lifecycle, no Storyboards, no AppDelegate by default.

## Design language

Restrained luxury. Quick rules of thumb:

- **Type:** Cormorant (display, serif) + Lato (UI, sans). Never a third family.
- **Color:** gold / cream / charcoal restraint — see `DesignSystem/Tokens/Colors.swift`.
  Mirrors the web `gold-*` palette from `tailwind.config.ts`.
- **Motion:** all durations under 300 ms, ease-in-out. No springs, no bouncy
  physics. See `DesignSystem/Tokens/Motion.swift`.
- **Spacing:** 4-pt baseline. See `DesignSystem/Tokens/Spacing.swift`.
- **Localization:** DE primary, EN secondary. Never inline a string in a view —
  use `Text("key")` (which resolves via `Localizable.strings`) or the `L10n`
  helper for non-view contexts.
- **Accessibility:** every interactive element must have an accessibility label.
  Verify with VoiceOver and AX5 Dynamic Type before declaring a screen done.
  - **Canonical product-row a11y label:** `"<brand> <name>, <price-per-day>"` —
    e.g. *"Rolex Datejust 41 Oystersteel, 390 € pro Tag"*. Brand-first matches
    how luxury watches and jewelry are referenced in catalogs and concierge
    conversation; brand + name are joined by a space (one product reference),
    and the comma separates the name block from the price. The visual hierarchy
    is still name-first with brand-as-uppercase-tag underneath — only the
    spoken order is brand-first. Apply to catalog rows, detail headers, cart
    line items, and search results.

## Code style

- Two-space indent for YAML / plist, four-space for Swift.
- One type per file when reasonable.
- No `print(...)` in production code paths.
- SwiftLint runs locally if installed (`brew install swiftlint`) and will be
  added to CI once the rule set settles. Run from `ios/`:
  ```bash
  swiftlint --strict
  ```

## CI

`.github/workflows/ios.yml` runs `xcodegen generate` then `xcodebuild build`
and `xcodebuild test` on `macos-14` for every push touching `ios/**`. The
existing Next.js workflow (`.github/workflows/ci.yml`) is untouched.

## Fonts

The repo does **not** yet vendor the Cormorant / Lato `.ttf` files —
`DesignSystem/Fonts/FONTS.md` has the licensing pointers and the exact steps
for adding them. Until then, `DSType` falls back to the system serif / sans so
the design tone stays intact.

## Out of scope (separate issues)

- Real API integration (see [Networking/Client.swift](Marianni/Networking/Client.swift))
- AR try-on (USDZ + RealityKit) — separate issue
- Apple Wallet pass authoring — separate issue
- App Store Connect, signing, provisioning — owned by CTO

## Common tasks

| Task | Command |
| --- | --- |
| Regenerate Xcode project after editing `project.yml` | `xcodegen generate` |
| Run unit tests on CLI | `xcodebuild ... test` (see above) |
| Lint | `swiftlint --strict` |
| Wipe DerivedData | `rm -rf ~/Library/Developer/Xcode/DerivedData/Marianni-*` |
