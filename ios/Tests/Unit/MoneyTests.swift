import XCTest
@testable import Marianni

final class MoneyTests: XCTestCase {
    func testGermanLocaleFormatsEuroWithCommaDecimal() {
        let formatted = Money.formatEuros(390, locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("390,00"), "Expected German comma decimal in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
    }

    func testEnglishLocaleFormatsEuroWithPeriodDecimal() {
        let formatted = Money.formatEuros(390, locale: Locale(identifier: "en_US"))
        XCTAssertTrue(formatted.contains("390.00"), "Expected US period decimal in \(formatted)")
    }

    func testZeroEurosFormats() {
        let formatted = Money.formatEuros(0, locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("0,00"), "Expected 0,00 in \(formatted)")
    }

    func testGermanRentalPerDayVisibleForm() {
        let formatted = Money.formatRentalPerDay(euros: 390, locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("390,00"), "Expected German amount in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
        XCTAssertTrue(formatted.hasSuffix("/Tag"), "Expected '/Tag' suffix in \(formatted)")
    }

    func testGermanRentalPerDayAccessibilityForm() {
        let formatted = Money.formatRentalPerDayAccessibility(euros: 390, locale: Locale(identifier: "de_DE"))
        XCTAssertTrue(formatted.contains("390,00"), "Expected German amount in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
        XCTAssertTrue(formatted.hasSuffix(" pro Tag"), "Expected ' pro Tag' suffix in \(formatted)")
    }

    func testEnglishRentalPerDayVisibleForm() {
        let formatted = Money.formatRentalPerDay(euros: 390, locale: Locale(identifier: "en_US"))
        XCTAssertTrue(formatted.contains("390.00"), "Expected US amount in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
        XCTAssertTrue(formatted.hasSuffix("/day"), "Expected '/day' suffix in \(formatted)")
    }

    func testEnglishRentalPerDayAccessibilityForm() {
        let formatted = Money.formatRentalPerDayAccessibility(euros: 390, locale: Locale(identifier: "en_US"))
        XCTAssertTrue(formatted.contains("390.00"), "Expected US amount in \(formatted)")
        XCTAssertTrue(formatted.contains("€"), "Expected € sign in \(formatted)")
        XCTAssertTrue(formatted.hasSuffix(" per day"), "Expected ' per day' suffix in \(formatted)")
    }
}
