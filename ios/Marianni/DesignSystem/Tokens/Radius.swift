import CoreGraphics

enum DSRadius {
    static let none: CGFloat = 0
    static let sm:   CGFloat = 4
    static let md:   CGFloat = 8
    static let lg:   CGFloat = 12
    static let xl:   CGFloat = 20
    /// Use with frames where `min(width, height) / 2` is preferable.
    static let pill: CGFloat = 999
}
