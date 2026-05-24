import SwiftUI

/// App root. Hands off between signed-out and signed-in shells, handles
/// incoming universal-link / custom-scheme URLs for the web auth handoff.
struct RootView: View {
    @EnvironmentObject private var session: AuthSession
    @State private var handoffError: String?

    var body: some View {
        Group {
            if session.isSignedIn {
                MainTabView()
            } else {
                SignInView(onOpenWebSignIn: openWebSignIn)
            }
        }
        .tint(DSColor.gold500)
        .onOpenURL(perform: handle)
        .alert(
            L10n.t("auth.handoff.error.title"),
            isPresented: Binding(
                get: { handoffError != nil },
                set: { if !$0 { handoffError = nil } }
            )
        ) {
            Button(L10n.t("common.ok"), role: .cancel) {}
        } message: {
            Text(handoffError ?? "")
        }
    }

    private func handle(_ url: URL) {
        guard let token = AuthHandoff.token(from: url) else { return }
        Task {
            do {
                try await session.completeHandoff(token: token)
            } catch {
                handoffError = String(describing: error)
            }
        }
    }

    private func openWebSignIn() {
        let env = APIEnvironment.resolve()
        let url = env.effectiveBaseURL().appendingPathComponent("auth/signin")
        UIApplication.shared.open(url)
    }
}
