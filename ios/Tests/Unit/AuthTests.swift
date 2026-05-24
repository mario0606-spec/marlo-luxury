import XCTest
@testable import Marianni

final class AuthHandoffTests: XCTestCase {
    func testParsesUniversalLinkToken() {
        let url = URL(string: "https://marloluxury.com/app/handoff?token=ott_abc123")!
        XCTAssertEqual(AuthHandoff.token(from: url), "ott_abc123")
    }

    func testParsesCustomSchemeToken() {
        let url = URL(string: "marianni://handoff?token=ott_def456")!
        XCTAssertEqual(AuthHandoff.token(from: url), "ott_def456")
    }

    func testRejectsWrongPath() {
        let url = URL(string: "https://marloluxury.com/something-else?token=x")!
        XCTAssertNil(AuthHandoff.token(from: url))
    }

    func testRejectsMissingToken() {
        let url = URL(string: "https://marloluxury.com/app/handoff")!
        XCTAssertNil(AuthHandoff.token(from: url))
    }

    func testRejectsEmptyToken() {
        let url = URL(string: "marianni://handoff?token=")!
        XCTAssertNil(AuthHandoff.token(from: url))
    }

    func testRejectsWrongScheme() {
        let url = URL(string: "ftp://marloluxury.com/app/handoff?token=x")!
        XCTAssertNil(AuthHandoff.token(from: url))
    }
}

@MainActor
final class AuthSessionTests: XCTestCase {
    func testStartsSignedOutWhenStorageIsEmpty() {
        let session = AuthSession(
            secureStorage: InMemorySecureStorage(),
            client: MockClient()
        )
        XCTAssertFalse(session.isSignedIn)
        XCTAssertNil(session.currentCredential)
    }

    func testCompleteHandoffPersistsSession() async throws {
        let storage = InMemorySecureStorage()
        let session = AuthSession(secureStorage: storage, client: MockClient())

        try await session.completeHandoff(token: "ott_abc123")

        XCTAssertTrue(session.isSignedIn)
        XCTAssertEqual(session.currentCredential?.user.email, "preview@marianni.test")
        // Persisted: a second session restored from the same storage is signed in.
        let restored = AuthSession(secureStorage: storage, client: MockClient())
        XCTAssertTrue(restored.isSignedIn)
    }

    func testSignOutClearsStorage() async throws {
        let storage = InMemorySecureStorage()
        let session = AuthSession(secureStorage: storage, client: MockClient())
        try await session.completeHandoff(token: "ott_abc123")
        XCTAssertTrue(session.isSignedIn)

        session.signOut()
        XCTAssertFalse(session.isSignedIn)
        XCTAssertNil(storage.data(forKey: "auth.session.v1"))
    }

    func testAccessTokenReturnsCurrentToken() async throws {
        let session = AuthSession(secureStorage: InMemorySecureStorage(), client: MockClient())
        try await session.completeHandoff(token: "ott_abc123")
        let token = await session.accessToken()
        XCTAssertNotNil(token)
        XCTAssertTrue(token!.hasPrefix("mock-access-"))
    }
}

final class SecureStorageTests: XCTestCase {
    func testInMemorySecureStorageRoundtrip() throws {
        let storage = InMemorySecureStorage()
        XCTAssertNil(storage.data(forKey: "k"))
        try storage.setData(Data("hello".utf8), forKey: "k")
        XCTAssertEqual(storage.data(forKey: "k"), Data("hello".utf8))
        try storage.setData(nil, forKey: "k")
        XCTAssertNil(storage.data(forKey: "k"))
    }
}
