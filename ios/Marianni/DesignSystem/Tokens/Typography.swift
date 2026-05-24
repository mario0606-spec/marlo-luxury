import SwiftUI
import UIKit

/// Typography tokens. Display = Cormorant (serif), UI = Lato (sans).
/// Real `.ttf`/`.otf` files are not yet committed — pending licensing confirmation
/// (see `DesignSystem/Fonts/FONTS.md`). Until then, `displayFamily` / `uiFamily`
/// resolve via the system serif / sans fallback. Once font files land and are
/// registered in Info.plist (`UIAppFonts`), only the constants below need to change.
enum DSType {
    static let displayFamily = "Cormorant"
    static let uiFamily      = "Lato"

    // Display (serif) — editorial moments.
    static let displayLarge:  Font = font(family: displayFamily, size: 40, weight: .medium, fallback: .system(size: 40, weight: .medium, design: .serif))
    static let displayMedium: Font = font(family: displayFamily, size: 28, weight: .medium, fallback: .system(size: 28, weight: .medium, design: .serif))
    static let displaySmall:  Font = font(family: displayFamily, size: 22, weight: .medium, fallback: .system(size: 22, weight: .medium, design: .serif))

    // UI (sans) — buttons, labels, dense text.
    static let bodyLarge: Font = font(family: uiFamily, size: 17, weight: .regular, fallback: .system(size: 17, weight: .regular, design: .default))
    static let body:      Font = font(family: uiFamily, size: 15, weight: .regular, fallback: .system(size: 15, weight: .regular, design: .default))
    static let caption:   Font = font(family: uiFamily, size: 12, weight: .regular, fallback: .system(size: 12, weight: .regular, design: .default))
    static let button:    Font = font(family: uiFamily, size: 15, weight: .semibold, fallback: .system(size: 15, weight: .semibold, design: .default))

    private static func font(family: String, size: CGFloat, weight: Font.Weight, fallback: Font) -> Font {
        // Until fonts are registered, return the fallback so the app still renders
        // with the correct design tone (serif vs sans) and weight.
        if UIFont.fontNames(forFamilyName: family).isEmpty {
            return fallback
        }
        return .custom(family, size: size).weight(weight)
    }
}
