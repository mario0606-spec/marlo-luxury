import SwiftUI

/// Brand-eyebrow / model-headline product row used everywhere a `CatalogItem`
/// appears in a list (catalog, cart, checkout summary, order history).
///
/// DACH luxury convention puts the brand as the scannable headline and demotes
/// the model name to a qualifier underneath. Inverting the older "model first"
/// hierarchy also unblocks AX5 Dynamic Type — the 28pt serif headline was the
/// failure mode in the [MAR-123](/MAR/issues/MAR-123) review.
struct ProductRow: View {
    let item: CatalogItem

    private var pricePerDay: String {
        Money.formatRentalPerDay(euros: item.dailyRate)
    }

    private var pricePerDayA11y: String {
        Money.formatRentalPerDayAccessibility(euros: item.dailyRate)
    }

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: DSSpacing.md) {
            VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                Text(item.brand)
                    .font(DSType.caption)
                    .foregroundStyle(DSColor.charcoal.opacity(0.65))
                    .textCase(.uppercase)
                    .kerning(1.2)
                    .lineLimit(1)
                Text(item.name)
                    .font(DSType.displaySmall)
                    .foregroundStyle(DSColor.charcoal)
            }
            Spacer(minLength: DSSpacing.md)
            Text(pricePerDay)
                .font(DSType.priceLabel)
                .foregroundStyle(DSColor.gold700)
        }
        .padding(.horizontal, DSSpacing.lg)
        .padding(.vertical, DSSpacing.md)
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        // Brand-first VoiceOver order matches the visual hierarchy and the
        // luxury catalog convention ("Rolex Datejust 41, 390 € pro Tag").
        .accessibilityLabel("\(item.brand) \(item.name), \(pricePerDayA11y)")
        .accessibilityIdentifier("product.row.\(item.slug)")
    }
}

/// Skeleton placeholder that mirrors the `ProductRow` hierarchy so the layout
/// doesn't jump when real data lands: a thin uppercase-eyebrow line on top and
/// a wider serif-headline line under it.
struct ProductRowSkeleton: View {
    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: DSSpacing.md) {
            VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                RoundedRectangle(cornerRadius: DSRadius.sm)
                    .fill(DSColor.stone200.opacity(0.6))
                    .frame(width: 80, height: 10)
                RoundedRectangle(cornerRadius: DSRadius.sm)
                    .fill(DSColor.stone200)
                    .frame(width: 200, height: 18)
            }
            Spacer()
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(DSColor.stone200.opacity(0.6))
                .frame(width: 56, height: 14)
        }
        .padding(.horizontal, DSSpacing.lg)
        .padding(.vertical, DSSpacing.md)
    }
}

#Preview("ProductRow — Light") {
    VStack(spacing: 0) {
        ForEach(MockClient.defaultFixtures.prefix(4)) { item in
            ProductRow(item: item)
            Divider()
                .overlay(DSColor.gold500.opacity(0.25))
                .padding(.horizontal, DSSpacing.lg)
        }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .background(DSColor.cream)
}

#Preview("ProductRow — Dark") {
    VStack(spacing: 0) {
        ForEach(MockClient.defaultFixtures.prefix(4)) { item in
            ProductRow(item: item)
            Divider()
                .overlay(DSColor.gold500.opacity(0.25))
                .padding(.horizontal, DSSpacing.lg)
        }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .background(DSColor.cream)
    .preferredColorScheme(.dark)
}

#Preview("ProductRow — AX5") {
    VStack(spacing: 0) {
        ForEach(MockClient.defaultFixtures.prefix(3)) { item in
            ProductRow(item: item)
            Divider()
                .overlay(DSColor.gold500.opacity(0.25))
                .padding(.horizontal, DSSpacing.lg)
        }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .background(DSColor.cream)
    .environment(\.dynamicTypeSize, .accessibility5)
}

#Preview("ProductRowSkeleton") {
    VStack(spacing: 0) {
        ForEach(0..<5, id: \.self) { _ in
            ProductRowSkeleton()
            Divider()
                .overlay(DSColor.gold500.opacity(0.15))
                .padding(.horizontal, DSSpacing.lg)
        }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .background(DSColor.cream)
    .redacted(reason: .placeholder)
}
