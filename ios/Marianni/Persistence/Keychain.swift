import Foundation
import Security

/// Secure-storage protocol. Backed by the iOS Keychain in production, by an
/// in-memory dictionary in tests/previews.
public protocol SecureStorage: AnyObject, Sendable {
    func data(forKey key: String) -> Data?
    func setData(_ data: Data?, forKey key: String) throws
}

public enum KeychainError: Error, Equatable {
    case unhandledStatus(OSStatus)
}

/// Keychain-backed implementation. Items use `kSecAttrAccessibleAfterFirstUnlock`
/// so background refresh works after first device unlock, but data is not
/// available before that (e.g. on a fresh reboot before passcode entry).
public final class KeychainStorage: SecureStorage, @unchecked Sendable {
    private let service: String

    public init(service: String = Bundle.main.bundleIdentifier ?? "com.marianni.app") {
        self.service = service
    }

    public func data(forKey key: String) -> Data? {
        var query = baseQuery(for: key)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        switch status {
        case errSecSuccess:
            return result as? Data
        case errSecItemNotFound:
            return nil
        default:
            return nil
        }
    }

    public func setData(_ data: Data?, forKey key: String) throws {
        let query = baseQuery(for: key)
        if let data {
            let attributes: [String: Any] = [
                kSecValueData as String: data,
                kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock,
            ]
            let updateStatus = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
            switch updateStatus {
            case errSecSuccess:
                return
            case errSecItemNotFound:
                var insert = query
                insert.merge(attributes) { _, new in new }
                let addStatus = SecItemAdd(insert as CFDictionary, nil)
                guard addStatus == errSecSuccess else {
                    throw KeychainError.unhandledStatus(addStatus)
                }
            default:
                throw KeychainError.unhandledStatus(updateStatus)
            }
        } else {
            let status = SecItemDelete(query as CFDictionary)
            if status != errSecSuccess && status != errSecItemNotFound {
                throw KeychainError.unhandledStatus(status)
            }
        }
    }

    private func baseQuery(for key: String) -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
        ]
    }
}

/// In-memory `SecureStorage` for tests and previews.
public final class InMemorySecureStorage: SecureStorage, @unchecked Sendable {
    private var store: [String: Data] = [:]
    private let queue = DispatchQueue(label: "InMemorySecureStorage.queue")

    public init() {}

    public func data(forKey key: String) -> Data? {
        queue.sync { store[key] }
    }

    public func setData(_ data: Data?, forKey key: String) throws {
        queue.sync {
            if let data { store[key] = data } else { store.removeValue(forKey: key) }
        }
    }
}
