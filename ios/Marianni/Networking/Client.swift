import Foundation

/// API surface the iOS app talks to.
///
/// `URLSessionClient` is the production implementation; `MockClient` is a
/// deterministic in-memory fixture used by previews and unit tests.
public protocol Client: Sendable {
    func fetchItems(query: ItemQuery) async throws -> CatalogPage
    func fetchItem(slug: String) async throws -> CatalogItem?
    func exchangeHandoffToken(_ token: String) async throws -> SessionCredential
    func refreshSession(refreshToken: String) async throws -> SessionCredential
}

/// Convenience: featured first page with default filters.
public extension Client {
    func fetchFeaturedItems() async throws -> [CatalogItem] {
        try await fetchItems(query: ItemQuery()).items
    }
}

/// Query parameters accepted by `/api/items`.
public struct ItemQuery: Equatable, Sendable {
    public var category: String?
    public var priceMin: Int?
    public var priceMax: Int?
    public var search: String?
    public var page: Int

    public init(
        category: String? = nil,
        priceMin: Int? = nil,
        priceMax: Int? = nil,
        search: String? = nil,
        page: Int = 1
    ) {
        self.category = category
        self.priceMin = priceMin
        self.priceMax = priceMax
        self.search = search
        self.page = page
    }

    /// URL query items in the order the web backend expects.
    public var urlQueryItems: [URLQueryItem] {
        var items: [URLQueryItem] = []
        if let category { items.append(URLQueryItem(name: "category", value: category)) }
        if let priceMin {
            let maxPart = priceMax.map(String.init) ?? ""
            items.append(URLQueryItem(name: "price", value: "\(priceMin)-\(maxPart)"))
        }
        if let search, !search.isEmpty {
            items.append(URLQueryItem(name: "q", value: search))
        }
        if page > 1 { items.append(URLQueryItem(name: "page", value: String(page))) }
        return items
    }
}

public enum ClientError: Error, Equatable {
    case notFound
    case unauthorized
    case transport(String)
    case decoding(String)
    case server(status: Int, message: String?)
}
