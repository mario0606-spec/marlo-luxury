import SwiftUI

@main
struct MarianniApp: App {
    var body: some Scene {
        WindowGroup {
            HomeView()
                .tint(DSColor.gold500)
                .preferredColorScheme(nil)
        }
    }
}
