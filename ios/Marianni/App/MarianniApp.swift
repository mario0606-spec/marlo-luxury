import SwiftUI

@main
struct MarianniApp: App {
    @StateObject private var session: AuthSession
    private let client: Client

    init() {
        let secureStorage = KeychainStorage()
        let providerBox = AuthSessionBox()
        let client = URLSessionClient(tokenProvider: providerBox)
        let session = AuthSession(secureStorage: secureStorage, client: client)
        providerBox.session = session

        self._session = StateObject(wrappedValue: session)
        self.client = client
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(session)
                .environment(\.apiClient, client)
        }
    }
}

/// Indirection that lets `URLSessionClient` ask the (later-constructed)
/// `AuthSession` for a fresh access token without retaining cycles or a
/// chicken-and-egg construction order.
final class AuthSessionBox: AuthTokenProvider, @unchecked Sendable {
    weak var session: AuthSession?
    func accessToken() async -> String? {
        await session?.accessToken()
    }
}

private struct APIClientKey: EnvironmentKey {
    static let defaultValue: Client = MockClient()
}

extension EnvironmentValues {
    var apiClient: Client {
        get { self[APIClientKey.self] }
        set { self[APIClientKey.self] = newValue }
    }
}
