import SwiftUI

/// Five-tab shell shown to signed-in users. Tab order, labels, and SF Symbols
/// are deliberate; coordinate with UXDesigner before changing them.
struct MainTabView: View {
    enum Tab: Hashable {
        case home, browse, favorites, reservations, profile
    }

    @State private var selection: Tab = .home

    var body: some View {
        TabView(selection: $selection) {
            HomeView()
                .tabItem {
                    Label {
                        Text(l10n: "tab.home")
                    } icon: {
                        Image(systemName: "house")
                    }
                }
                .tag(Tab.home)

            BrowseView()
                .tabItem {
                    Label {
                        Text(l10n: "tab.browse")
                    } icon: {
                        Image(systemName: "square.grid.2x2")
                    }
                }
                .tag(Tab.browse)

            FavoritesView()
                .tabItem {
                    Label {
                        Text(l10n: "tab.favorites")
                    } icon: {
                        Image(systemName: "heart")
                    }
                }
                .tag(Tab.favorites)

            ReservationsView()
                .tabItem {
                    Label {
                        Text(l10n: "tab.reservations")
                    } icon: {
                        Image(systemName: "calendar")
                    }
                }
                .tag(Tab.reservations)

            ProfileView()
                .tabItem {
                    Label {
                        Text(l10n: "tab.profile")
                    } icon: {
                        Image(systemName: "person.crop.circle")
                    }
                }
                .tag(Tab.profile)
        }
    }
}

#Preview("Light") {
    MainTabView()
        .environmentObject(AuthSession(
            secureStorage: InMemorySecureStorage(),
            client: MockClient()
        ))
        .preferredColorScheme(.light)
}
