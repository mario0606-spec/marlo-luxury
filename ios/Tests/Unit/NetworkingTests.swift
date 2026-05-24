import XCTest
@testable import Marianni

final class NetworkingTests: XCTestCase {
    func testItemQueryEncodesAllFields() {
        let query = ItemQuery(category: "watch", priceMin: 100, priceMax: 500, search: "rolex", page: 2)
        let items = query.urlQueryItems
        XCTAssertEqual(items.count, 4)
        XCTAssertEqual(items[0], URLQueryItem(name: "category", value: "watch"))
        XCTAssertEqual(items[1], URLQueryItem(name: "price", value: "100-500"))
        XCTAssertEqual(items[2], URLQueryItem(name: "q", value: "rolex"))
        XCTAssertEqual(items[3], URLQueryItem(name: "page", value: "2"))
    }

    func testItemQueryOmitsDefaults() {
        let query = ItemQuery()
        XCTAssertTrue(query.urlQueryItems.isEmpty)
    }

    func testItemQueryPriceWithOpenMax() {
        let query = ItemQuery(priceMin: 50, priceMax: nil)
        XCTAssertEqual(
            query.urlQueryItems,
            [URLQueryItem(name: "price", value: "50-")]
        )
    }

    func testCatalogPageDecodesBackendShape() throws {
        let json = """
        {
          "items": [{
            "id": "abc",
            "slug": "rolex-datejust",
            "name": "Datejust",
            "brand": "Rolex",
            "category": "watch",
            "dailyRate": 390,
            "weeklyRate": 2200,
            "images": ["https://example.com/a.jpg"],
            "available": true,
            "featured": true
          }],
          "total": 1,
          "page": 1,
          "pageSize": 12
        }
        """.data(using: .utf8)!

        let page = try JSONDecoder().decode(CatalogPage.self, from: json)
        XCTAssertEqual(page.total, 1)
        XCTAssertEqual(page.items.first?.brand, "Rolex")
        XCTAssertEqual(page.items.first?.primaryImageURL?.absoluteString, "https://example.com/a.jpg")
    }

    func testEnvironmentBaseURLs() {
        XCTAssertEqual(APIEnvironment.development.baseURL.host, "localhost")
        XCTAssertEqual(APIEnvironment.staging.baseURL.host, "staging.marloluxury.com")
        XCTAssertEqual(APIEnvironment.production.baseURL.host, "marloluxury.com")
    }
}
