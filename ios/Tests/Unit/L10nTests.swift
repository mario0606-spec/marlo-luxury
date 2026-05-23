import XCTest
@testable import Marianni

final class L10nTests: XCTestCase {
    func testAppNameResolvesFromStringsTable() {
        XCTAssertEqual(L10n.appName, "marianni")
    }

    func testUnknownKeyFallsBackToKey() {
        XCTAssertEqual(L10n.t("nonexistent.key"), "nonexistent.key")
    }

    func testTaglineIsNonEmpty() {
        XCTAssertFalse(L10n.tagline.isEmpty)
    }
}
