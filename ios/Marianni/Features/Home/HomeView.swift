import SwiftUI

struct HomeView: View {
    let client: Client

    init(client: Client = MockClient()) {
        self.client = client
    }

    var body: some View {
        NavigationStack {
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

                    NavigationLink {
                        CatalogListView(client: client)
                    } label: {
                        DSButtonLabel(variant: .outline) {
                            Text(L10n.homeCtaOpenCatalog)
                        }
                    }
                    .accessibilityIdentifier("home.openCatalog")

                    Spacer().frame(height: DSSpacing.xxl)
                }
            }
            .accessibilityElement(children: .contain)
        }
    }
}

#Preview("Light") {
    HomeView().preferredColorScheme(.light)
}

#Preview("Dark") {
    HomeView().preferredColorScheme(.dark)
}
