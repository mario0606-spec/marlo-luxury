import Foundation

/// Read-only API surface the iOS app talks to. Real implementation lands in a
/// separate issue; until then the app wires up `MockClient`.
protocol Client: Sendable {
    func fetchFeaturedItems() async throws -> [CatalogItem]
    func fetchItem(slug: String) async throws -> CatalogItem?
}

enum ClientError: Error, Equatable {
    case notFound
    case transport(String)
    case decoding(String)
}
