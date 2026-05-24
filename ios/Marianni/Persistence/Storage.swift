import Foundation

/// Local key/value persistence facade. Backed by `UserDefaults` for now; will be
/// swapped for a typed store (SwiftData / Keychain split) in a later issue.
protocol Storage: AnyObject {
    func string(forKey key: String) -> String?
    func setString(_ value: String?, forKey key: String)
}

final class UserDefaultsStorage: Storage {
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func string(forKey key: String) -> String? {
        defaults.string(forKey: key)
    }

    func setString(_ value: String?, forKey key: String) {
        if let value {
            defaults.set(value, forKey: key)
        } else {
            defaults.removeObject(forKey: key)
        }
    }
}

final class InMemoryStorage: Storage {
    private var store: [String: String] = [:]

    func string(forKey key: String) -> String? {
        store[key]
    }

    func setString(_ value: String?, forKey key: String) {
        if let value {
            store[key] = value
        } else {
            store.removeValue(forKey: key)
        }
    }
}
