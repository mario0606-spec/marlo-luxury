import SwiftUI

struct CatalogListView: View {
    @StateObject var viewModel: CatalogListViewModel

    init(client: Client) {
        _viewModel = StateObject(wrappedValue: CatalogListViewModel(client: client))
    }

    var body: some View {
        ZStack {
            DSColor.cream.ignoresSafeArea()
            content
                .animation(DSMotion.easeStandard, value: viewModel.state)
        }
        .navigationTitle(L10n.catalogTitle)
        .navigationBarTitleDisplayMode(.large)
        .task { await viewModel.load() }
        .refreshable { await viewModel.reload() }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            CatalogSkeletonList()
        case .empty:
            EmptyStateView(message: L10n.catalogEmpty)
        case .failed(let message):
            ErrorStateView(message: message) {
                Task { await viewModel.reload() }
            }
        case .loaded(let items):
            CatalogList(items: items)
        }
    }
}

private struct CatalogList: View {
    let items: [CatalogItem]

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(items) { item in
                    CatalogRow(item: item)
                    Divider()
                        .frame(height: 1)
                        .overlay(DSColor.gold500.opacity(0.25))
                        .padding(.horizontal, DSSpacing.lg)
                }
            }
            .padding(.vertical, DSSpacing.md)
        }
        .accessibilityIdentifier("catalog.list")
    }
}

private struct CatalogRow: View {
    let item: CatalogItem

    private var price: String {
        Money.format(cents: item.priceCents, currency: item.currency)
    }

    private var pricePerDay: String { L10n.catalogRowPricePerDay(price) }
    private var pricePerDayA11y: String { L10n.catalogRowPricePerDayA11y(price) }

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: DSSpacing.md) {
            VStack(alignment: .leading, spacing: DSSpacing.xs) {
                Text(item.title)
                    .font(DSType.displayMedium)
                    .foregroundStyle(DSColor.charcoal)
                Text(item.brand)
                    .font(DSType.body)
                    .foregroundStyle(DSColor.charcoal.opacity(0.65))
                    .textCase(.uppercase)
                    .kerning(1.0)
            }
            Spacer(minLength: DSSpacing.md)
            Text(pricePerDay)
                .font(DSType.caption)
                .foregroundStyle(DSColor.gold700)
        }
        .padding(.horizontal, DSSpacing.lg)
        .padding(.vertical, DSSpacing.md)
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(item.title), \(item.brand), \(pricePerDayA11y)")
        .accessibilityIdentifier("catalog.row.\(item.slug)")
    }
}

private struct CatalogSkeletonList: View {
    var body: some View {
        VStack(spacing: 0) {
            ForEach(0..<7, id: \.self) { _ in
                HStack(alignment: .firstTextBaseline, spacing: DSSpacing.md) {
                    VStack(alignment: .leading, spacing: DSSpacing.xs) {
                        RoundedRectangle(cornerRadius: DSRadius.sm)
                            .fill(DSColor.stone200)
                            .frame(width: 200, height: 22)
                        RoundedRectangle(cornerRadius: DSRadius.sm)
                            .fill(DSColor.stone200.opacity(0.6))
                            .frame(width: 120, height: 14)
                    }
                    Spacer()
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .fill(DSColor.stone200.opacity(0.6))
                        .frame(width: 56, height: 14)
                }
                .padding(.horizontal, DSSpacing.lg)
                .padding(.vertical, DSSpacing.md)
                Divider()
                    .frame(height: 1)
                    .overlay(DSColor.gold500.opacity(0.15))
                    .padding(.horizontal, DSSpacing.lg)
            }
        }
        .padding(.top, DSSpacing.md)
        .redacted(reason: .placeholder)
        .accessibilityHidden(true)
    }
}

private struct EmptyStateView: View {
    let message: String

    var body: some View {
        VStack(spacing: DSSpacing.md) {
            RoundedRectangle(cornerRadius: DSRadius.pill)
                .fill(DSColor.gold500)
                .frame(width: 48, height: 3)
            Text(message)
                .font(DSType.bodyLarge)
                .foregroundStyle(DSColor.charcoal.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(.horizontal, DSSpacing.xl)
        }
        .accessibilityElement(children: .combine)
    }
}

private struct ErrorStateView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: DSSpacing.md) {
            Text(message)
                .font(DSType.body)
                .foregroundStyle(DSColor.charcoal.opacity(0.8))
                .multilineTextAlignment(.center)
                .padding(.horizontal, DSSpacing.xl)
                .accessibilityIdentifier("catalog.error.message")
            Button(action: retry) {
                Text(L10n.commonRetry)
                    .font(DSType.button)
                    .foregroundStyle(DSColor.charcoal)
                    .padding(.horizontal, DSSpacing.lg)
                    .padding(.vertical, DSSpacing.md)
                    .frame(minHeight: 44)
                    .overlay(
                        RoundedRectangle(cornerRadius: DSRadius.pill)
                            .stroke(DSColor.gold500, lineWidth: 1)
                    )
            }
            .accessibilityIdentifier("catalog.retry")
        }
    }
}

#Preview("Loaded — Light") {
    NavigationStack { CatalogListView(client: MockClient()) }
        .preferredColorScheme(.light)
}

#Preview("Loaded — Dark") {
    NavigationStack { CatalogListView(client: MockClient()) }
        .preferredColorScheme(.dark)
}

#Preview("Loaded — AX5") {
    NavigationStack { CatalogListView(client: MockClient()) }
        .environment(\.dynamicTypeSize, .accessibility5)
}

#Preview("Empty") {
    NavigationStack { CatalogListView(client: MockClient(fixtures: [])) }
}
