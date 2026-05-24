import Foundation
import SwiftUI

/// Localization helper. Use `L10n.appName` for typed access, or `L10n.t("key")`
/// for ad-hoc keys. Views should prefer the `LocalizedStringKey`-accepting
/// SwiftUI initializers (`Text("app.name")`) when possible — this helper is the
/// escape hatch when you need a plain `String`.
enum L10n {
    static var appName: String { t("app.name") }
    static var tagline: String { t("app.tagline") }

    static func t(_ key: String, comment: String = "") -> String {
        Bundle.main.localizedString(forKey: key, value: key, table: nil)
    }
}

extension Bundle {
    /// Returns the localized string for `key` from the main bundle, falling back
    /// to the key itself when the lookup fails. Use sparingly — prefer
    /// `Text(LocalizedStringKey(...))` in views so Xcode's strings tooling can
    /// find every reference.
    func localized(_ key: String) -> String {
        localizedString(forKey: key, value: key, table: nil)
    }
}

extension Text {
    /// Convenience initializer that pins a SwiftUI `Text` to a string-table key.
    init(l10n key: String) {
        self.init(LocalizedStringKey(key))
    }
}
