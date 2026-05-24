import XCTest
@testable import Marianni

@MainActor
final class CatalogListViewModelTests: XCTestCase {
    func testLoadedStateWhenClientReturnsItems() async {
        let vm = CatalogListViewModel(client: MockClient())
        await vm.reload()
        guard case .loaded(let items) = vm.state else {
            XCTFail("Expected .loaded, got \(vm.state)")
            return
        }
        XCTAssertEqual(items.count, MockClient.defaultFixtures.count)
    }

    func testEmptyStateWhenClientReturnsNothing() async {
        let vm = CatalogListViewModel(client: MockClient(fixtures: []))
        await vm.reload()
        XCTAssertEqual(vm.state, .empty)
    }

    func testFailedStateMapsToGenericMessage() async {
        let vm = CatalogListViewModel(client: ThrowingClient())
        await vm.reload()
        guard case .failed(let message) = vm.state else {
            XCTFail("Expected .failed, got \(vm.state)")
            return
        }
        XCTAssertFalse(message.isEmpty)
    }

    func testLoadIsIdempotentOnceLoaded() async {
        let vm = CatalogListViewModel(client: MockClient())
        await vm.reload()
        let firstState = vm.state
        await vm.load()
        XCTAssertEqual(vm.state, firstState)
    }
}

private struct ThrowingClient: Client {
    func fetchFeaturedItems() async throws -> [CatalogItem] {
        throw ClientError.transport("offline")
    }
    func fetchItem(slug: String) async throws -> CatalogItem? {
        throw ClientError.transport("offline")
    }
}
