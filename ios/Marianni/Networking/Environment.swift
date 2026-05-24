import Foundation

/// Backend environment the app talks to. Selected at launch from
/// `APIEnvironment` Info.plist key (or a debug override), then cached on the
/// `APIClient`.
public enum APIEnvironment: String, Sendable, CaseIterable {
    case development
    case staging
    case production

    public var baseURL: URL {
        switch self {
        case .development:
            // Simulator default; override via `APIEnvironmentBaseURL` Info.plist
            // entry when running against a LAN dev box.
            return URL(string: "http://localhost:3000")!
        case .staging:
            return URL(string: "https://staging.marloluxury.com")!
        case .production:
            return URL(string: "https://marloluxury.com")!
        }
    }

    /// Resolves the active environment from the app's Info.plist. Falls back to
    /// `.development` in DEBUG builds and `.production` otherwise.
    public static func resolve(bundle: Bundle = .main) -> APIEnvironment {
        if let raw = bundle.object(forInfoDictionaryKey: "APIEnvironment") as? String,
           let env = APIEnvironment(rawValue: raw) {
            return env
        }
        #if DEBUG
        return .development
        #else
        return .production
        #endif
    }

    /// Optional override URL — useful for pointing a debug build at a LAN host
    /// without rebuilding. Returns `baseURL` when no override is configured.
    public func effectiveBaseURL(bundle: Bundle = .main) -> URL {
        if let override = bundle.object(forInfoDictionaryKey: "APIEnvironmentBaseURL") as? String,
           let url = URL(string: override) {
            return url
        }
        return baseURL
    }
}
