import Foundation

@MainActor
final class CatalogListViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case loading
        case loaded([CatalogItem])
        case empty
        case failed(String)
    }

    @Published private(set) var state: State = .idle

    private let client: Client

    init(client: Client) {
        self.client = client
    }

    func load() async {
        if case .loaded = state { return }
        await reload()
    }

    func reload() async {
        state = .loading
        do {
            let items = try await client.fetchFeaturedItems()
            state = items.isEmpty ? .empty : .loaded(items)
        } catch {
            state = .failed(L10n.catalogErrorGeneric)
        }
    }
}
