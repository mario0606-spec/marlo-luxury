import XCTest
@testable import Marianni

final class MockClientTests: XCTestCase {
    func testFetchFeaturedItemsReturnsFixtures() async throws {
        let client = MockClient()
        let items = try await client.fetchFeaturedItems()
        XCTAssertFalse(items.isEmpty)
        XCTAssertEqual(items.first?.brand, "Rolex")
    }

    func testFetchItemsAppliesCategoryFilter() async throws {
        let client = MockClient()
        let page = try await client.fetchItems(query: ItemQuery(category: "jewelry"))
        XCTAssertEqual(page.items.count, 1)
        XCTAssertEqual(page.items.first?.brand, "Cartier")
    }

    func testFetchItemsAppliesSearchFilter() async throws {
        let client = MockClient()
        let page = try await client.fetchItems(query: ItemQuery(search: "datejust"))
        XCTAssertEqual(page.items.count, 1)
        XCTAssertEqual(page.items.first?.slug, "rolex-datejust-41-oystersteel")
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

    func testExchangeHandoffTokenReturnsSession() async throws {
        let client = MockClient()
        let session = try await client.exchangeHandoffToken("ott-12345")
        XCTAssertFalse(session.accessToken.isEmpty)
        XCTAssertEqual(session.user.email, "preview@marianni.test")
    }

    func testExchangeHandoffTokenRejectsEmpty() async {
        let client = MockClient()
        do {
            _ = try await client.exchangeHandoffToken("")
            XCTFail("expected unauthorized")
        } catch ClientError.unauthorized {
            // ok
        } catch {
            XCTFail("unexpected error: \(error)")
        }
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
