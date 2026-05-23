# Brand Fonts

TODO: Add real font files once licensing is confirmed.

## Cormorant (display / serif)
- Source: Google Fonts — https://fonts.google.com/specimen/Cormorant
- License: SIL Open Font License 1.1 (OFL) — embeddable in apps, no royalty.
- Files needed: `Cormorant-Regular.ttf`, `Cormorant-Medium.ttf`, `Cormorant-SemiBold.ttf`.

## Lato (UI / sans)
- Source: Google Fonts — https://fonts.google.com/specimen/Lato
- License: SIL Open Font License 1.1 (OFL) — embeddable in apps, no royalty.
- Files needed: `Lato-Regular.ttf`, `Lato-Medium.ttf`, `Lato-SemiBold.ttf`, `Lato-Bold.ttf`.

## When adding files
1. Drop the `.ttf` files in this directory.
2. Add them to `UIAppFonts` in `App/Info.plist`:
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>Cormorant-Regular.ttf</string>
     <string>Cormorant-Medium.ttf</string>
     <string>Cormorant-SemiBold.ttf</string>
     <string>Lato-Regular.ttf</string>
     <string>Lato-Medium.ttf</string>
     <string>Lato-SemiBold.ttf</string>
     <string>Lato-Bold.ttf</string>
   </array>
   ```
3. Re-run `xcodegen generate`. `DSType` already falls back to system serif/sans
   until the named families resolve, so no Swift changes are required.
4. Update `Tests/Unit/DesignSystemTests.swift::testFontFamiliesPresent` to assert
   the families load.
