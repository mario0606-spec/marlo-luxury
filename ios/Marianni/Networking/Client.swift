import Foundation

/// Read-only API surface the iOS app talks to. Real implementation lands in a
/// separate issue; until then the app wires up `MockClient`.
protocol Client: Sendable {
    func fetchFeaturedItems() async throws -> [CatalogItem]
    func fetchItem(slug: String) async throws -> CatalogItem?
}

struct CatalogItem: Identifiable, Equatable, Sendable {
    let id: String
    let slug: String
    let title: String
    let brand: String
    let priceCents: Int
    let currency: String  // ISO 4217, e.g. "EUR"
    let imageURL: URL?
}

enum ClientError: Error, Equatable {
    case notFound
    case transport(String)
    case decoding(String)
}
