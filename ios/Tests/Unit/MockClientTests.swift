import XCTest
@testable import Marianni

final class MockClientTests: XCTestCase {
    func testFetchFeaturedItemsReturnsFixtures() async throws {
        let client = MockClient()
        let items = try await client.fetchFeaturedItems()
        XCTAssertFalse(items.isEmpty)
        XCTAssertGreaterThan(items.first?.dailyRate ?? 0, 0)
    }

    func testFetchItemBySlugFindsKnownFixture() async throws {
        let client = MockClient()
        let item = try await client.fetchItem(slug: "rolex-datejust-41-oystersteel")
        XCTAssertNotNil(item)
        XCTAssertEqual(item?.brand, "Rolex")
    }

    func testFetchItemBySlugReturnsNilForUnknown() async throws {
        let client = MockClient()
        let item = try await client.fetchItem(slug: "does-not-exist")
        XCTAssertNil(item)
    }

    func testInMemoryStorageRoundtrip() {
        let storage: Storage = InMemoryStorage()
        XCTAssertNil(storage.string(forKey: "k"))
        storage.setString("v", forKey: "k")
        XCTAssertEqual(storage.string(forKey: "k"), "v")
        storage.setString(nil, forKey: "k")
        XCTAssertNil(storage.string(forKey: "k"))
    }
}
