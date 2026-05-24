import SwiftUI

/// Signed-out landing screen. Points the user to the web flow so they can
/// authenticate there and be deep-linked back into the app.
struct SignInView: View {
    let onOpenWebSignIn: () -> Void

    var body: some View {
        ZStack {
            DSColor.cream.ignoresSafeArea()

            VStack(spacing: DSSpacing.lg) {
                Spacer()

                Text(L10n.appName)
                    .font(DSType.displayLarge)
                    .foregroundStyle(DSColor.charcoal)
                    .kerning(1.5)

                Text(l10n: "auth.signin.subtitle")
                    .font(DSType.bodyLarge)
                    .foregroundStyle(DSColor.charcoal.opacity(0.7))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, DSSpacing.xl)

                Spacer()

                Button(action: onOpenWebSignIn) {
                    Text(l10n: "auth.signin.cta")
                        .font(DSType.button)
                        .frame(maxWidth: .infinity, minHeight: 52)
                }
                .buttonStyle(.borderedProminent)
                .tint(DSColor.gold500)
                .padding(.horizontal, DSSpacing.xl)
                .accessibilityIdentifier("auth.signin.cta")

                Text(l10n: "auth.signin.footnote")
                    .font(DSType.caption)
                    .foregroundStyle(DSColor.stone500)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, DSSpacing.xl)
                    .padding(.bottom, DSSpacing.xxl)
            }
        }
        .accessibilityElement(children: .contain)
    }
}

#Preview("Light") {
    SignInView(onOpenWebSignIn: {}).preferredColorScheme(.light)
}

#Preview("Dark") {
    SignInView(onOpenWebSignIn: {}).preferredColorScheme(.dark)
}
