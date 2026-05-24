import Foundation

/// User profile fields the iOS app cares about. The web `User` table has more —
/// add fields here as the app actually needs them, not pre-emptively.
public struct UserProfile: Equatable, Sendable, Codable {
    public let id: String
    public let email: String
    public let name: String?
    public let locale: String?
}

/// Persisted session credential. `accessToken` is short-lived; `refreshToken`
/// is exchanged at the auth endpoint for a fresh access token.
///
/// Stored in the Keychain — never in `UserDefaults`.
public struct SessionCredential: Equatable, Sendable, Codable {
    public let accessToken: String
    public let refreshToken: String?
    public let expiresAt: Date?
    public let user: UserProfile

    public init(
        accessToken: String,
        refreshToken: String?,
        expiresAt: Date?,
        user: UserProfile
    ) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.expiresAt = expiresAt
        self.user = user
    }

    public var isExpired: Bool {
        guard let expiresAt else { return false }
        return expiresAt <= Date()
    }
}
