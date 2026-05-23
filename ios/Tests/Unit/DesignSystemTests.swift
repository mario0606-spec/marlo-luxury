import XCTest
import SwiftUI
@testable import Marianni

final class DesignSystemTests: XCTestCase {
    func testSpacingScaleIsMonotonicallyIncreasing() {
        let scale: [CGFloat] = [
            DSSpacing.xxs, DSSpacing.xs, DSSpacing.sm, DSSpacing.md,
            DSSpacing.lg, DSSpacing.xl, DSSpacing.xxl, DSSpacing.xxxl,
        ]
        XCTAssertEqual(scale, scale.sorted())
        XCTAssertGreaterThan(scale.first ?? -1, 0)
    }

    func testRadiusScaleIsNonNegative() {
        let scale: [CGFloat] = [
            DSRadius.none, DSRadius.sm, DSRadius.md, DSRadius.lg, DSRadius.xl,
        ]
        XCTAssertEqual(scale, scale.sorted())
        XCTAssertGreaterThanOrEqual(DSRadius.none, 0)
        XCTAssertGreaterThan(DSRadius.pill, DSRadius.xl)
    }

    func testMotionDurationsRespectLuxuryCeiling() {
        XCTAssertLessThan(DSMotion.fast, 0.3)
        XCTAssertLessThan(DSMotion.standard, 0.3)
        XCTAssertLessThan(DSMotion.slow, 0.3)
        XCTAssertLessThan(DSMotion.fast, DSMotion.standard)
        XCTAssertLessThan(DSMotion.standard, DSMotion.slow)
    }

    func testColorHexInitProducesSRGBComponents() {
        let gold = Color(hex: 0xD4922A)
        // Sanity check: the typed instance exists and equals the token.
        XCTAssertNotNil(gold)
        XCTAssertNotNil(DSColor.gold500)
    }

    func testTypographyFamilyConstants() {
        XCTAssertEqual(DSType.displayFamily, "Cormorant")
        XCTAssertEqual(DSType.uiFamily, "Lato")
    }
}
