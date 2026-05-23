import SwiftUI

/// Motion tokens. Luxury restraint: all under 300 ms, ease-in-out, no bouncy springs.
enum DSMotion {
    static let fast:     Double = 0.12
    static let standard: Double = 0.20
    static let slow:     Double = 0.28

    static let easeStandard: Animation = .easeInOut(duration: standard)
    static let easeFast:     Animation = .easeInOut(duration: fast)
    static let easeSlow:     Animation = .easeInOut(duration: slow)
}
