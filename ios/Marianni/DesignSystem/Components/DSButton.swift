import SwiftUI

/// Marianni's canonical pill button.
///
/// Two variants — `outline` (gold stroke on cream) and `filled` (gold capsule, cream
/// label) — both guaranteeing a ≥44pt tappable area per Apple HIG. Centralising this
/// pattern prevents the sub-HIG / hand-rolled variants we shipped on MAR-123.
///
/// For `NavigationLink`, which already provides its own tap target, use
/// `DSButtonLabel` directly as the `label:` closure to keep the same visual
/// treatment without nesting a `Button`.
struct DSButton<Label: View>: View {
    let variant: DSButtonVariant
    let action: () -> Void
    @ViewBuilder let label: () -> Label

    init(variant: DSButtonVariant, action: @escaping () -> Void, @ViewBuilder label: @escaping () -> Label) {
        self.variant = variant
        self.action = action
        self.label = label
    }

    var body: some View {
        Button(action: action) {
            DSButtonLabel(variant: variant, content: label)
        }
        .buttonStyle(.plain)
    }
}

enum DSButtonVariant {
    case outline
    case filled
}

/// Styling-only counterpart to `DSButton`. Use inside `NavigationLink`, swipe
/// actions, or anywhere that already supplies its own tap behaviour.
struct DSButtonLabel<Content: View>: View {
    let variant: DSButtonVariant
    @ViewBuilder let content: () -> Content

    init(variant: DSButtonVariant, @ViewBuilder content: @escaping () -> Content) {
        self.variant = variant
        self.content = content
    }

    var body: some View {
        content()
            .font(DSType.button)
            .foregroundStyle(foreground)
            .multilineTextAlignment(.center)
            .padding(.horizontal, DSSpacing.xl)
            .padding(.vertical, DSSpacing.md)
            .frame(minHeight: 44)
            .background(background)
            .contentShape(Capsule())
    }

    private var foreground: Color {
        switch variant {
        case .filled:  return DSColor.cream
        case .outline: return DSColor.charcoal
        }
    }

    @ViewBuilder
    private var background: some View {
        switch variant {
        case .filled:
            Capsule().fill(DSColor.gold500)
        case .outline:
            Capsule().stroke(DSColor.gold500, lineWidth: 1)
        }
    }
}

#Preview("DSButton — variants") {
    VStack(spacing: DSSpacing.xl) {
        HStack(spacing: DSSpacing.lg) {
            DSButton(variant: .outline) {} label: {
                Text("Reservieren")
            }
            DSButton(variant: .filled) {} label: {
                Text("Checkout")
            }
        }

        HStack(spacing: DSSpacing.lg) {
            DSButton(variant: .outline) {} label: {
                Text("Retry")
            }
            DSButton(variant: .filled) {} label: {
                Text("Open catalog")
            }
        }
    }
    .padding(DSSpacing.xl)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(DSColor.cream)
}

#Preview("DSButton — variants (dark)") {
    VStack(spacing: DSSpacing.xl) {
        DSButton(variant: .outline) {} label: { Text("Reservieren") }
        DSButton(variant: .filled) {} label: { Text("Checkout") }
    }
    .padding(DSSpacing.xl)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(DSColor.cream)
    .preferredColorScheme(.dark)
}

#Preview("DSButton — AX5 (wraps inside capsule)") {
    VStack(spacing: DSSpacing.xl) {
        DSButton(variant: .outline) {} label: {
            Text("Erneut versuchen")
        }
        DSButton(variant: .filled) {} label: {
            Text("Katalog öffnen")
        }
    }
    .padding(DSSpacing.xl)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(DSColor.cream)
    .environment(\.dynamicTypeSize, .accessibility5)
}
