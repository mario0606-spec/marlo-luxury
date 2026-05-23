import SwiftUI

struct HomeView: View {
    var body: some View {
        ZStack {
            DSColor.cream.ignoresSafeArea()

            VStack(spacing: DSSpacing.lg) {
                Spacer()

                Text(L10n.appName)
                    .font(DSType.displayLarge)
                    .foregroundStyle(DSColor.charcoal)
                    .kerning(1.5)

                Text(L10n.tagline)
                    .font(DSType.bodyLarge)
                    .foregroundStyle(DSColor.charcoal.opacity(0.7))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, DSSpacing.xl)

                Spacer()

                RoundedRectangle(cornerRadius: DSRadius.pill)
                    .fill(DSColor.gold500)
                    .frame(width: 56, height: 4)
                    .accessibilityHidden(true)

                Spacer().frame(height: DSSpacing.xxl)
            }
        }
        .accessibilityElement(children: .contain)
    }
}

#Preview("Light") {
    HomeView().preferredColorScheme(.light)
}

#Preview("Dark") {
    HomeView().preferredColorScheme(.dark)
}
