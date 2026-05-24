import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var session: AuthSession

    var body: some View {
        ZStack {
            DSColor.cream.ignoresSafeArea()

            VStack(alignment: .leading, spacing: DSSpacing.md) {
                Text(l10n: "tab.profile")
                    .font(DSType.displayMedium)
                    .foregroundStyle(DSColor.charcoal)
                    .padding(.top, DSSpacing.xl)

                if let user = session.currentCredential?.user {
                    VStack(alignment: .leading, spacing: DSSpacing.xs) {
                        if let name = user.name, !name.isEmpty {
                            Text(name)
                                .font(DSType.displaySmall)
                                .foregroundStyle(DSColor.charcoal)
                        }
                        Text(user.email)
                            .font(DSType.body)
                            .foregroundStyle(DSColor.charcoal.opacity(0.7))
                    }
                }

                Spacer()

                Button(role: .destructive) {
                    session.signOut()
                } label: {
                    Text(l10n: "profile.signout")
                        .font(DSType.button)
                        .frame(maxWidth: .infinity, minHeight: 52)
                }
                .buttonStyle(.bordered)
                .tint(DSColor.gold700)
                .accessibilityIdentifier("profile.signout")
            }
            .padding(.horizontal, DSSpacing.xl)
            .padding(.bottom, DSSpacing.xl)
        }
    }
}

#Preview {
    ProfileView()
        .environmentObject(AuthSession(
            secureStorage: InMemorySecureStorage(),
            client: MockClient()
        ))
}
