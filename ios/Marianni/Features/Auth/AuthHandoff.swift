import Foundation

/// Parses an incoming universal-link URL into a one-time handoff token.
///
/// The web app redirects authed users to
/// `https://<host>/app/handoff?token=<ott>` (or the `marianni://` custom scheme
/// fallback) when they tap "Open in iOS app". The token is single-use,
/// short-lived, and exchanged at `/api/auth/mobile/handoff` for a real session.
public enum AuthHandoff {
    public static let handoffPath = "/app/handoff"
    public static let customScheme = "marianni"

    /// Extracts a handoff token from a URL. Accepts either a universal link
    /// (`https://...marloluxury.com/app/handoff?token=...`) or the custom-scheme
    /// fallback (`marianni://handoff?token=...`).
    public static func token(from url: URL) -> String? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }

        let isUniversal = components.scheme?.lowercased() == "https"
            && components.path == handoffPath
        let isCustom = components.scheme?.lowercased() == customScheme
            && (components.host == "handoff" || components.path == "/handoff")

        guard isUniversal || isCustom else { return nil }

        let token = components.queryItems?
            .first(where: { $0.name == "token" })?
            .value?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        guard let token, !token.isEmpty else { return nil }
        return token
    }
}
