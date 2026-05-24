import Foundation

/// Canonical iOS model that mirrors the web backend catalog shape.
/// Rates are whole euros (Marlo is EUR-only for v1). See ADR in MAR-135.
public struct CatalogItem: Identifiable, Equatable, Sendable, Codable {
    public let id: String
    public let slug: String
    public let name: String
    public let brand: String
    public let category: String
    public let dailyRate: Int
    public let weeklyRate: Int?
    public let images: [String]
    public let available: Bool
    public let featured: Bool

    public init(
        id: String,
        slug: String,
        name: String,
        brand: String,
        category: String,
        dailyRate: Int,
        weeklyRate: Int? = nil,
        images: [String] = [],
        available: Bool = true,
        featured: Bool = false
    ) {
        self.id = id
        self.slug = slug
        self.name = name
        self.brand = brand
        self.category = category
        self.dailyRate = dailyRate
        self.weeklyRate = weeklyRate
        self.images = images
        self.available = available
        self.featured = featured
    }
}
