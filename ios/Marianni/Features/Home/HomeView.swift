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
                        Text(L10n.catalogTitle)
                            .font(DSType.button)
                            .foregroundStyle(DSColor.charcoal)
                            .padding(.horizontal, DSSpacing.xl)
                            .padding(.vertical, DSSpacing.md)
                            .overlay(
                                RoundedRectangle(cornerRadius: DSRadius.pill)
                                    .stroke(DSColor.gold500, lineWidth: 1)
                            )
                    }
                    .accessibilityIdentifier("home.openCatalog")

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
}

#Preview("Light") {
    HomeView().preferredColorScheme(.light)
}

#Preview("Dark") {
    HomeView().preferredColorScheme(.dark)
}
