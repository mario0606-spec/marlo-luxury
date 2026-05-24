import Foundation

/// Catalog item as returned by the web backend (`/api/items`).
///
/// Mirrors the public fields selected in `src/app/api/items/route.ts`. The web
/// side stores monetary rates as integers (whole-euro daily rate), so we keep
/// the same representation here and format at the view layer.
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
        weeklyRate: Int?,
        images: [String],
        available: Bool,
        featured: Bool
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

    public var primaryImageURL: URL? {
        images.first.flatMap(URL.init(string:))
    }
}

/// Paginated envelope used by `/api/items`.
public struct CatalogPage: Equatable, Sendable, Codable {
    public let items: [CatalogItem]
    public let total: Int
    public let page: Int
    public let pageSize: Int
}
