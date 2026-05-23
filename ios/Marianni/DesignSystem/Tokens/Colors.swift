import SwiftUI

/// Brand color tokens. Hex values mirror the web side's `gold-*` / `stone-*` palette
/// (see `tailwind.config.ts`). Keep these in sync when web tokens change.
enum DSColor {
    // Gold ramp — primary brand accent.
    static let gold50  = Color(hex: 0xFDF9ED)
    static let gold100 = Color(hex: 0xF9F0D0)
    static let gold200 = Color(hex: 0xF3DFA0)
    static let gold300 = Color(hex: 0xECC766)
    static let gold400 = Color(hex: 0xE5AF38)
    static let gold500 = Color(hex: 0xD4922A)
    static let gold600 = Color(hex: 0xB87320)
    static let gold700 = Color(hex: 0x8E531C)
    static let gold800 = Color(hex: 0x74431D)
    static let gold900 = Color(hex: 0x62391B)
    static let gold950 = Color(hex: 0x371D0B)

    // Neutrals.
    static let cream    = Color(hex: 0xF7F2E8)
    static let charcoal = Color(hex: 0x1E1B16)
    static let stone200 = Color(hex: 0xE7E5E4)
    static let stone500 = Color(hex: 0x78716C)
}

extension Color {
    init(hex: UInt32, opacity: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}
