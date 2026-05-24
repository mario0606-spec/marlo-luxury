# Snapshot Tests

Placeholder. Snapshot tests will land in a follow-up issue once the snapshot
library is chosen with CTO (likely
[`pointfreeco/swift-snapshot-testing`](https://github.com/pointfreeco/swift-snapshot-testing)).

When added:

1. Add the Swift Package dependency in `project.yml` under `packages:`.
2. Move this folder into a `MarianniSnapshotTests` target in `project.yml`.
3. Cover at least: `HomeView` (light + dark, default + AX5 Dynamic Type), and
   any new design-system primitives.
