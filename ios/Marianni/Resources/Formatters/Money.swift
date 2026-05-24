import Foundation

enum Money {
    static func format(cents: Int, currency: String, locale: Locale = .current) -> String {
        let formatter = NumberFormatter()
        formatter.locale = locale
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        let amount = Decimal(cents) / 100
        return formatter.string(from: amount as NSDecimalNumber) ?? "\(amount) \(currency)"
    }

    /// Visible price including the rental period — e.g. "390,00 €/Tag" (DE), "€390.00/day" (EN).
    static func formatRentalPerDay(cents: Int, currency: String, locale: Locale = .current) -> String {
        let price = format(cents: cents, currency: currency, locale: locale)
        return String(format: template(forKey: "catalog.row.pricePerDay", locale: locale), price)
    }

    /// VoiceOver long form — e.g. "390,00 € pro Tag", "€390.00 per day".
    static func formatRentalPerDayAccessibility(cents: Int, currency: String, locale: Locale = .current) -> String {
        let price = format(cents: cents, currency: currency, locale: locale)
        return String(format: template(forKey: "catalog.row.pricePerDay.a11y", locale: locale), price)
    }

    // Look up a localized template for the requested locale's language, falling
    // back to the main bundle. Needed because `Bundle.main.localizedString` is
    // pinned to the app's active language and ignores the per-call locale.
    private static func template(forKey key: String, locale: Locale) -> String {
        let lang = locale.language.languageCode?.identifier
        if let lang,
           let path = Bundle.main.path(forResource: lang, ofType: "lproj"),
           let bundle = Bundle(path: path) {
            return bundle.localizedString(forKey: key, value: key, table: nil)
        }
        return Bundle.main.localizedString(forKey: key, value: key, table: nil)
    }
}
