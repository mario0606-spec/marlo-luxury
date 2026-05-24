import XCTest
@testable import Marianni

final class MoneyTests: XCTestCase {
    func testGermanLocaleFormatsEuroWithCommaDecimal() {
        let formatted = Money.format(cents: 39000, currency: "EUR", locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("390,00"), "Expected German comma decimal in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
    }

    func testEnglishLocaleFormatsEuroWithPeriodDecimal() {
        let formatted = Money.format(cents: 39000, currency: "EUR", locale: Locale(identifier: "en_US"))
        XCTAssertTrue(formatted.contains("390.00"), "Expected US period decimal in \(formatted)")
    }

    func testSubEuroAmountRoundsToTwoDecimals() {
        let formatted = Money.format(cents: 5, currency: "EUR", locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("0,05"), "Expected 0,05 in \(formatted)")
    }
}
