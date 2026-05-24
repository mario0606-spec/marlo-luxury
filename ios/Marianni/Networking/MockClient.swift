import Foundation

/// In-memory fixture client used by previews and unit tests.
public struct MockClient: Client {
    public let fixtures: [CatalogItem]
    public let pageSize: Int

    public init(fixtures: [CatalogItem] = MockClient.defaultFixtures, pageSize: Int = 12) {
        self.fixtures = fixtures
        self.pageSize = pageSize
    }

    public func fetchItems(query: ItemQuery) async throws -> CatalogPage {
        var filtered = fixtures
        if let category = query.category {
            filtered = filtered.filter { $0.category == category }
        }
        if let search = query.search, !search.isEmpty {
            let needle = search.lowercased()
            filtered = filtered.filter {
                $0.name.lowercased().contains(needle)
                    || $0.brand.lowercased().contains(needle)
            }
        }
        return CatalogPage(
            items: filtered,
            total: filtered.count,
            page: query.page,
            pageSize: pageSize
        )
    }

    public func fetchItem(slug: String) async throws -> CatalogItem? {
        fixtures.first { $0.slug == slug }
    }

    public func exchangeHandoffToken(_ token: String) async throws -> SessionCredential {
        guard !token.isEmpty else { throw ClientError.unauthorized }
        return SessionCredential(
            accessToken: "mock-access-\(token.prefix(6))",
            refreshToken: "mock-refresh",
            expiresAt: Date().addingTimeInterval(60 * 60),
            user: UserProfile(
                id: "mock-user",
                email: "preview@marianni.test",
                name: "Preview User",
                locale: "de"
            )
        )
    }

    public func refreshSession(refreshToken: String) async throws -> SessionCredential {
        guard !refreshToken.isEmpty else { throw ClientError.unauthorized }
        return SessionCredential(
            accessToken: "mock-access-refreshed",
            refreshToken: refreshToken,
            expiresAt: Date().addingTimeInterval(60 * 60),
            user: UserProfile(
                id: "mock-user",
                email: "preview@marianni.test",
                name: "Preview User",
                locale: "de"
            )
        )
    }

    public static let defaultFixtures: [CatalogItem] = [
        CatalogItem(
            id: "1",
            slug: "rolex-datejust-41-oystersteel",
            name: "Datejust 41 Oystersteel",
            brand: "Rolex",
            category: "watch",
            dailyRate: 390,
            weeklyRate: 2200,
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
            weeklyRate: 1600,
            images: [],
            available: true,
            featured: false
        ),
    ]
}
