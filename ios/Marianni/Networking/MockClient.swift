import Foundation

/// In-memory fixture client used until the real API integration lands.
/// Returns a small, deterministic catalog so previews and unit tests render.
struct MockClient: Client {
    let fixtures: [CatalogItem]

    init(fixtures: [CatalogItem] = MockClient.defaultFixtures) {
        self.fixtures = fixtures
    }

    func fetchFeaturedItems() async throws -> [CatalogItem] {
        fixtures
    }

    func fetchItem(slug: String) async throws -> CatalogItem? {
        fixtures.first { $0.slug == slug }
    }

    static let defaultFixtures: [CatalogItem] = [
        CatalogItem(
            id: "1",
            slug: "rolex-datejust-41-oystersteel",
            name: "Datejust 41 Oystersteel",
            brand: "Rolex",
            category: "watches",
            dailyRate: 390,
            weeklyRate: 2340,
            images: [],
            available: true,
            featured: true
        ),
        CatalogItem(
            id: "2",
            slug: "cartier-love-bracelet-yellow-gold",
            name: "Love Bracelet, Yellow Gold",
            brand: "Cartier",
            category: "jewelry",
            dailyRate: 290,
            weeklyRate: 1740,
            images: [],
            available: true,
            featured: true
        ),
    ]
}
