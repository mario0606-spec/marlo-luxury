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
            title: "Datejust 41 Oystersteel",
            brand: "Rolex",
            priceCents: 39000,
            currency: "EUR",
            imageURL: nil
        ),
        CatalogItem(
            id: "2",
            slug: "cartier-love-bracelet-yellow-gold",
            title: "Love Bracelet, Yellow Gold",
            brand: "Cartier",
            priceCents: 29000,
            currency: "EUR",
            imageURL: nil
        ),
    ]
}
