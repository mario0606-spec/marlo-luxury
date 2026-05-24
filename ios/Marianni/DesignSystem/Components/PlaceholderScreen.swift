import SwiftUI

/// Shared "coming soon" stub used by tabs whose real views land in follow-up
/// issues (PDP, Calendar, Notifications, Wallet). One file so the typography
/// and spacing stay consistent.
struct PlaceholderScreen: View {
    let titleKey: String
    let messageKey: String

    var body: some View {
        ZStack {
            DSColor.cream.ignoresSafeArea()

            VStack(alignment: .leading, spacing: DSSpacing.md) {
                Text(l10n: titleKey)
                    .font(DSType.displayMedium)
                    .foregroundStyle(DSColor.charcoal)
                    .padding(.top, DSSpacing.xl)

                Text(l10n: messageKey)
                    .font(DSType.bodyLarge)
                    .foregroundStyle(DSColor.charcoal.opacity(0.7))

                Spacer()
            }
            .padding(.horizontal, DSSpacing.xl)
        }
        .accessibilityElement(children: .contain)
    }
}
