import Foundation
import SwiftUI

/// Observable auth state for the app. Owns the active `SessionCredential` and
/// persists it in secure storage. The network client reads the access token
/// through the `AuthTokenProvider` protocol.
@MainActor
public final class AuthSession: ObservableObject, AuthTokenProvider {
    public enum State: Equatable {
        case signedOut
        case signedIn(SessionCredential)
    }

    @Published public private(set) var state: State = .signedOut

    private let secureStorage: SecureStorage
    private let storageKey: String
    private let clientProvider: () -> Client

    private static let defaultStorageKey = "auth.session.v1"

    public init(
        secureStorage: SecureStorage,
        storageKey: String = AuthSession.defaultStorageKey,
        client: @escaping @autoclosure () -> Client
    ) {
        self.secureStorage = secureStorage
        self.storageKey = storageKey
        self.clientProvider = client
        restore()
    }

    public var isSignedIn: Bool {
        if case .signedIn = state { return true }
        return false
    }

    public var currentCredential: SessionCredential? {
        if case .signedIn(let credential) = state { return credential }
        return nil
    }

    // MARK: - AuthTokenProvider

    public func accessToken() async -> String? {
        guard let credential = currentCredential else { return nil }
        if credential.isExpired, let refresh = credential.refreshToken {
            do {
                let refreshed = try await clientProvider().refreshSession(refreshToken: refresh)
                persist(refreshed)
                return refreshed.accessToken
            } catch {
                signOut()
                return nil
            }
        }
        return credential.accessToken
    }

    // MARK: - Public surface

    /// Exchanges a one-time handoff token for a session and stores it.
    public func completeHandoff(token: String) async throws {
        let credential = try await clientProvider().exchangeHandoffToken(token)
        persist(credential)
    }

    public func signOut() {
        try? secureStorage.setData(nil, forKey: storageKey)
        state = .signedOut
    }

    // MARK: - Persistence

    private func persist(_ credential: SessionCredential) {
        do {
            let data = try JSONEncoder.iso8601.encode(credential)
            try secureStorage.setData(data, forKey: storageKey)
            state = .signedIn(credential)
        } catch {
            state = .signedIn(credential)
        }
    }

    private func restore() {
        guard let data = secureStorage.data(forKey: storageKey) else { return }
        do {
            let credential = try JSONDecoder.iso8601.decode(SessionCredential.self, from: data)
            state = .signedIn(credential)
        } catch {
            state = .signedOut
        }
    }
}

extension JSONEncoder {
    static let iso8601: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
}

extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
}
